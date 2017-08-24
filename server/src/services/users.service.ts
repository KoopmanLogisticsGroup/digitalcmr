'use strict';

import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {User} from '../entities/user.model';
import {DataService} from '../datasource/DataService';
import {Participant} from '../entities/participant.model';
import {BusinessNetworkHandler} from '../middleware/BusinessNetworkHandler';
import {Address} from '../entities/address.model';

export class UsersService {
  private dataService: DataService;
  private businessNetworkHandler: BusinessNetworkHandler;
  private adminUsername: string = 'admin';
  private adminPassword: string = 'adminpw';
  private namespace: string     = 'org.digitalcmr';
  private logger: LoggerInstance = Container.get(LoggerFactory).create('Users Service');

  public constructor() {
    this.dataService            = Container.get(DataService);
    this.businessNetworkHandler = new BusinessNetworkHandler(this.adminUsername, this.adminPassword);
  }

  public async addUser(participant: Participant): Promise<any> {
    this.logger.info('[Users service]' , 'Adding user: ' + participant.userID);

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      // add participant to asset registry
      this.addParticipantToAssetRegistry(participant).then(() => {
        //issue identity to participant
        this.issueIdentityToParticipant(participant).then((identity) => {
          //create new user object and save it into db
          let user: User = this.buildUserObject(participant, identity);
          this.addUserToDB(user).then(() => {
            this.logger.info('[Users service]' , 'User: ' + participant.userID + 'successfully added');
            resolve('Success');
          }).catch((error) => {
            this.logger.error('Was not possible to save user ' + participant.userID + 'to DB');
            resolve('Was not possible to save user ' + participant.userID + 'to DB');
          });
        }).catch((error) => {
          this.logger.error('[Users service]' , 'Was not possible to issue the identity to ' + participant.userID + ' to Blockchain');
          resolve('Was not possible to issue the identity to ' + participant.userID + ' to Blockchain');
        });
      }).catch((error) => {
        if (error.toString().indexOf('already exists') !== -1) {
          this.logger.debug('[Users service]' , 'User: ' + participant.userID + ' already exists');
          resolve('User: ' + participant.userID + 'already exists');
        } else {
          this.logger.error('Was not possible to add participant ' + participant.userID + ' to Blockchain: ', error);
          resolve('Was not possible to add participant ' + participant.userID + ' to Blockchain');
        }
      });
    });
  }

  private buildUserObject(participant: Participant, identity: any): User {

    let user = new User({

      'userID':    participant.userID,
      'username':  participant.userName,
      'password':  participant.password,
      'org':       participant.org.split('#')[1],
      'userEmail': participant.userID,
      'role':      participant.$class,
      'secret':    identity.userSecret
    });

    return user;
  }

  private async addParticipantToAssetRegistry(participant: Participant): Promise<any> {

    const businessNetworkConnection = await this.businessNetworkHandler.connect();
    let factory                     = await businessNetworkConnection.getBusinessNetwork().getFactory();
    let participantResource         = this.buildParticipantResource(participant, factory);

    // add participant to asset registry
    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      businessNetworkConnection.getParticipantRegistry(this.namespace + '.' + participant.$class)
        .then((participantRegistry) => {
          participantRegistry.add(participantResource).then((participantRegistry) => {
            resolve('success');
          }).catch((error) => {
            reject(new Error('Participant' + participant.userID + ' add error: ' + error));
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private buildParticipantResource(participant: Participant, factory: any): any {
    const participantResource = factory.newResource(this.namespace, participant.$class, participant.userID);

    participantResource.userName  = participant.userName;
    participantResource.firstName = participant.firstName;
    participantResource.lastName  = participant.lastName;
    participantResource.address   = this.buildAddress(participant.address, factory);
    const orgClass                = participant.org.split('#')[0];
    const orgInstance             = participant.org.split('#')[1];
    participantResource.org       = factory.newRelationship(this.namespace, orgClass, orgInstance);

    return participantResource;

  }

  private buildAddress(address: Address, factory: any): any {
    let addressConcept         = factory.newConcept(this.namespace, 'Address');
    addressConcept.name        = address.name;
    addressConcept.street      = address.street;
    addressConcept.houseNumber = address.houseNumber;
    addressConcept.city        = address.city;
    addressConcept.zipCode     = address.zipCode;
    addressConcept.country     = address.country;
    addressConcept.longitude   = address.longitude;
    addressConcept.latitude    = address.latitude;

    return addressConcept;
  }

  private async issueIdentityToParticipant(participant: Participant): Promise<any> {

    const businessNetworkConnection = await this.businessNetworkHandler.connect();

    return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
      this.logger.debug('[Users service]' , 'Issuing identity for participant ' + this.namespace + '.' + participant.$class + '#' + participant.userID, participant.userID);
      businessNetworkConnection.issueIdentity(this.namespace + '.' + participant.$class + '#' + participant.userID, participant.userID)
        .then((identity) => {
          resolve(identity);
        })
        .catch((error) => {
            reject(error);
          }
        );
    });
  }

  private addUserToDB(user: User): Promise<any> {
    return this.dataService.putDocuments([user], user.userID).then((result: any) => {
      this.logger.debug('[Users service]' , 'User ' + user.userID + 'successfully added to DB');
    }).catch((err: any) => {
      this.logger.error('[Users service]' , 'It was not possible to add ' + user.userID + 'to DB :', err);
    });
  }
}