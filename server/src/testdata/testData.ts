'use strict';

const testData = require('../../resources/testData.json');
import {LoggerInstance} from 'winston';
import {User} from '../entities/user.model';
import {DataService} from '../datasource/DataService';

export class TestData {
  public constructor(private dataService: DataService, private logger: LoggerInstance) {
  }

  public async addTestData(): Promise<any> {
    this.logger.info('[TestData] Deploying Test Data');
    return this.addTestDataToDB(testData);
  }

  private addTestDataToDB(testData: any): Promise<any> {
    testData.users = testData.users.map(
      (user: any) => new User(user)
    );

    return this.dataService.addTestData(testData).then((result: any) => {
      this.logger.info('[TestData] Added testdata');
    }).catch((err: any) => {
      this.logger.error(err);
    });
  }
}
