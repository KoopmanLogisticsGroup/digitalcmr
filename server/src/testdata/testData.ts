'use strict';

const testData     = require('../../resources/testData.json');
const participants = require('../../resources/participants.json').participants;
import {LoggerInstance} from 'winston';
import {DataService} from '../datasource/DataService';
import {UsersService} from '../services/users.service';
import {Participant} from '../entities/participant.model';
import {TransactionHandler} from '../middleware';
import {Vehicle, ECMR} from '../sdk/api';

export class TestData {
  private userService: UsersService;
  private _transactor: TransactionHandler;

  public constructor(private dataService: DataService, private logger: LoggerInstance) {
    this.userService = new UsersService();
    this._transactor = new TransactionHandler();
  }

  public async addTestData(): Promise<any> {
    this.logger.info('[TestData] Deploying Test Data');

    await this.addParticipants();

    if (!(Object.keys(testData).length > 0)) {
      return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
        resolve('Testdata empty');
      });
    }

    if (testData.organizations && testData.organizations.legalOwnerOrgs && testData.organizations.legalOwnerOrgs.length) {
      this.logger.info('Adding Legal Owner Org');
      await this.addOrgs(testData.organizations.legalOwnerOrgs, 'legalOwnerOrg');
    }
    if (testData.organizations && testData.organizations.compoundOrgs && testData.organizations.compoundOrgs.length) {
      this.logger.info('Adding Compound Org');
      await this.addOrgs(testData.organizations.compoundOrgs, 'compoundOrg');
    }
    if (testData.organizations && testData.organizations.carrierOrgs && testData.organizations.carrierOrgs.length) {
      this.logger.info('Adding Carrier Org');
      await this.addOrgs(testData.organizations.carrierOrgs, 'carrierOrg');
    }
    if (testData.organizations && testData.organizations.recipientOrgs && testData.organizations.recipientOrgs.length) {
      this.logger.info('Adding Recipient Org');
      await this.addOrgs(testData.organizations.recipientOrgs, 'recipientOrg');
    }
    if (testData.vehicles && testData.vehicles.length) {
      this.logger.info('Adding Vehicles');
      await this.addVehicles(testData.vehicles);
    }
    if (testData.ecmrs && testData.ecmrs.length) {
      this.logger.info('Adding Ecmrs');
      await this.addEcmrs(testData.ecmrs);
    }

  }

  private async addOrgs(orgs: any[], orgClass: string): Promise<any> {
    let promises = [];
    for (let org of orgs) {
      // get all the ecmrs contained in the vehicle
      switch (orgClass) {
        case 'legalOwnerOrg': {
          promises.push(this._transactor.put(org, 'admin', 'adminpw', (factory, data) => this._transactor.createLegalOwnerOrg(factory, data, 'admin')));
          break;
        }

        case 'compoundOrg': {
          promises.push(this._transactor.put(org, 'admin', 'adminpw', (factory, data) => this._transactor.createCompoundOrg(factory, data, 'admin')));
          break;
        }

        case 'carrierOrg': {
          promises.push(this._transactor.put(org, 'admin', 'adminpw', (factory, data) => this._transactor.createCarrierOrg(factory, data, 'admin')));
          break;
        }

        case 'recipientOrg': {
          promises.push(this._transactor.put(org, 'admin', 'adminpw', (factory, data) => this._transactor.createRecipientOrg(factory, data, 'admin')));
          break;
        }
      }
    }
    return Promise.all(promises).then((result) => {
      return result;
    });
  }

  private async addVehicles(vehicles: Vehicle[]): Promise<any> {
    return this._transactor.put(vehicles, 'admin', 'adminpw', (factory, data) => this._transactor.createVehicles(factory, data, 'admin'));
  }

  private async addEcmrs(ecmrs: ECMR[]): Promise<any> {
    let promises = [];
    for (let ecmr of ecmrs) {
      // get all the ecmrs contained in the vehicle
      promises.push(this._transactor.put(ecmr, 'admin', 'adminpw', (factory, data) => this._transactor.createECMR(factory, data, 'admin')));
    }
    return Promise.all(promises).then((result) => {
      return result;
    });
  }

  private async addParticipants(): Promise<any> {
    this.logger.info('[TestData]Adding participants');

    for (let participant of participants) {
      this.userService.addUser(participant);
    }

    let adminUser: Participant = new Participant({
      $class:    'org.hyperledger.composer.system.Participant',
      org:       '',
      userID:    'admin',
      userName:  'admin',
      password:  'passw0rd',
      firstName: 'admin',
      lastName:  'admin',
      address:   {}
    });

    let identity = {
      userSecret: 'adminpw'
    };

    this.userService.addExistingUser(adminUser, identity);
  }

  private addTestDataToDB(testData: any): Promise<any> {

    return this.dataService.addTestData(testData).then((result: any) => {
      this.logger.info('[TestData] Added testdata');
    }).catch((err: any) => {
      this.logger.error(err);
    });
  }
}
