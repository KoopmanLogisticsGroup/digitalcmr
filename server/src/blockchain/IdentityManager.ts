import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {DataService} from '../datasource/DataService';
import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import {Factory} from 'composer-common';
import {ParticipantCreator} from '../domain/participants/ParticipantCreator';
import {Config} from '../config/index';
import {Entity, Identity, UserInfo} from '../interfaces/entity.inferface';
import {UserApp} from '../domain/users/models/UserApp';

export class IdentityManager {
  private dataService: DataService;
  private businessNetworkHandler: BusinessNetworkHandler;
  private logger: LoggerInstance;
  private static connectionProfile: string = Config.settings.composer.profile;

  public constructor(private namespace: string) {
    this.dataService            = Container.get(DataService);
    this.businessNetworkHandler = Container.get(BusinessNetworkHandler);
    this.logger                 = Container.get(LoggerFactory).get('IdentityManager');
  }

  public async addEntity(identity: Identity, entity: Entity): Promise<any> {
    this.logger.info('Adding entity: ', entity.participant[entity.participant.participantID]);

    await this.businessNetworkHandler.connect(identity, IdentityManager.connectionProfile);
    try {
      await this.addParticipant(entity.participant);
      this.logger.debug('Participant ' + entity.participant.$class + ' successfully added to Blockchain');
    } catch (error) {
      if (error.message.indexOf('exists') !== -1) {
        this.logger.warn('User: ' + entity.userApp.username + ' already exists');
        return;
      }

      this.logger.error('It was not possible to add participant ' + entity.participant[entity.participant.participantID] + ' to Blockchain', error);
    }

    try {
      const identity: Identity = await this.issueIdentityWithParticipant(entity.participant, entity.identity.userID);
      entity.userApp.identity  = identity;
      this.logger.debug('Identity ' + entity.userApp.identity.userID + ' for participant ' + this.namespace + '.' + entity.participant.$class + '#' + entity.participant[entity.participant.participantID] + ' added with success to MSP');
    } catch (error) {
      throw new Error('It was not possible to add identity ' + entity.userApp.username + ' to Blockchain ' + error);
    }

    try {
      await this.addUserToDB(entity.userApp);
      this.logger.debug('User ' + entity.userApp.username + ' successfully added to DB');

      this.logger.info('Entity: ' + entity.userApp.username + ' successfully added');
    } catch (error) {
      this.logger.error('It was not possible to add ' + entity.userApp.username + ' to DB', error);
    }
  }

  private async addParticipant(participant: any): Promise<any> {
    const factory: Factory = await this.businessNetworkHandler.getFactory();

    // participant should not have participantID otherwise Composer will throw an exception
    // the original object with participantID should be preserve for further operations
    let formatParticipant = Object.assign({}, participant);
    delete formatParticipant.participantID;

    const participantResource = ParticipantCreator.buildParticipant(factory, this.namespace, formatParticipant, participant[participant.participantID]);
    const participantRegistry = await this.businessNetworkHandler.getParticipantRegistry(this.namespace + '.' + participant.$class);

    return participantRegistry.add(participantResource);
  }

  private async issueIdentityWithParticipant(participant: any, userID: string): Promise<any> {
    return this.businessNetworkHandler.issueIdentity(this.namespace + '.' + participant.$class + '#' + participant[participant.participantID], userID);
  }

  private async addUserToDB(userInfo: UserInfo): Promise<any> {
    const userApp = new UserApp(userInfo);

    return this.dataService.putDocument('users', userApp, userApp.username);
  }

  public async addAdmin(adminIdentity: Identity, adminUser: any): Promise<any> {
    adminUser.identity = adminIdentity;

    try {
      await this.addUserToDB(adminUser);
      this.logger.debug('User ' + adminUser.username + ' successfully added to DB');

      this.logger.info('Entity: ' + adminUser.username + ' successfully added');
    } catch (error) {
      this.logger.error('It was not possible to add ' + adminUser.username + ' to DB', error);
    }
  }
}
