'use strict';

const testData     = require('../../resources/testData.json');
const participants = require('../../resources/participants.json').participants;
import {LoggerInstance} from 'winston';
import {DataService} from '../datasource/DataService';
import {UsersService} from '../services/users.service';
import {Participant} from '../entities/participant.model';

export class TestData {
  private userService: UsersService;

  public constructor(private dataService: DataService, private logger: LoggerInstance) {
    this.userService = new UsersService();
  }

  public async addTestData(): Promise<any> {
    this.logger.info('[TestData] Deploying Test Data');
    await this.addParticipants();
    if (Object.keys(testData).length > 0) {
      return this.addTestDataToDB(testData);
    } else {
      return new Promise((resolve: (result: any) => void, reject: (error: Error) => void) => {
        resolve('Testdata empty');
      });
    }
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
      address: {}
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
