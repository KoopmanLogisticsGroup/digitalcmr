import 'reflect-metadata';
import {useExpressServer, useContainer, RoutingControllersOptions} from 'routing-controllers';
import {Container} from 'typedi';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from './utils';
import {Config} from './config';
import * as debug from 'debug';
import {IDebugger} from 'debug';
import {Application} from 'express';
import {TestData} from './utils/TestData';
import {BusinessNetworkHandler} from './blockchain/BusinessNetworkHandler';
import {TransactionHandler} from './blockchain/TransactionHandler';
import * as ComposerClient from 'composer-client';
import {DataService} from './datasource/DataService';
import {IdentityManager} from './blockchain/IdentityManager';
import {UserInfo} from './interfaces/entity.inferface';

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance       = this.loggerFactory.get('App');
  private debug: IDebugger             = debug('app:main');

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
    Container.set(TransactionHandler, new TransactionHandler(Container.get(BusinessNetworkHandler)));
    Container.set(IdentityManager, new IdentityManager(Config.settings.composer.namespace));

    if (process.env.INIT) {
      await this.addTestData();
    }

    if (process.env.NODE_ENV === 'pon') {
      await new TestData(Container.get(TransactionHandler),
        Container.get(DataService),
        Container.get(IdentityManager)).addAdmin(<UserInfo> {
        username:  'adminPon',
        password:  '@dm1nPassw0rd',
        firstName: 'adminPon',
        lastName:  'adminPon',
        role:      'adminPon'
      });
    }

    const apiPath                                              = Config.settings.apiPath;
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix:         apiPath,
      controllers:         [`${__dirname}${apiPath}/*.ts`]
    };

    this.debug('routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    this.debug('listen');
    app.listen(Config.settings.port as number, Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);

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
