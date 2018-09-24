import 'reflect-metadata';
import {RoutingControllersOptions, useContainer} from 'routing-controllers';
import {Container} from 'typedi';
import * as express from 'express';
import {Application} from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from './utils';
import {Config} from './config';
import * as debug from 'debug';
import {IDebugger} from 'debug';
import {TestData} from './utils/TestData';
import {BusinessNetworkHandler} from './blockchain/BusinessNetworkHandler';
import {TransactionHandler} from './blockchain/TransactionHandler';
import * as ComposerClient from 'composer-client';
import {DataService} from './datasource/DataService';
import {IdentityManager} from './blockchain/IdentityManager';
import {UserInfo} from './interfaces/entity.inferface';
import {ConnectionPoolManager} from './connections/ConnectionPoolManager';

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance       = this.loggerFactory.get('App');
  private debug: IDebugger             = debug('app:main');
  private isInitRequired: boolean      = process.env.INIT === 'true';
  private routingControllersOptions: RoutingControllersOptions;

  public async run(): Promise<void> {
    this.debug('starting express app');
    const app: Application = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(this.loggerFactory.requestLogger);

    this.debug('dependency injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);
    Container.set(DataService, new DataService());
    Container.set(BusinessNetworkHandler, new BusinessNetworkHandler(new ComposerClient.BusinessNetworkConnection()));
    Container.set(TransactionHandler, new TransactionHandler());
    Container.set(ConnectionPoolManager, new ConnectionPoolManager());
    Container.set(IdentityManager, new IdentityManager(Config.settings.composer.namespace));

    await new TestData(Container.get(TransactionHandler),
      Container.get(DataService),
      Container.get(IdentityManager)).addAdmin(<UserInfo> {
      username:  process.env.ADMIN_USERNAME,
      password:  process.env.ADMIN_PASSWORD,
      firstName: process.env.ADMIN_FIRSTNAME,
      lastName:  process.env.ADMIN_LASTNAME,
      role:      process.env.ADMIN_ROLE
    });

    if (this.isInitRequired) {
      await this.addTestData();
    }

    const apiPath                  = Config.settings.apiPath;
    this.routingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix:         apiPath,
      controllers:         [`${__dirname}${apiPath}/*.ts`]
    };

    this.debug('routing: %o', this.routingControllersOptions);

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }

  private async addTestData(): Promise<any> {
    return new TestData(Container.get(TransactionHandler),
      Container.get(DataService),
      Container.get(IdentityManager)).addTestData()
      .catch((error: Error) => {
        return error;
      });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
