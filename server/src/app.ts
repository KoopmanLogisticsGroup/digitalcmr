import 'reflect-metadata';
import {useExpressServer, useContainer, RoutingControllersOptions} from 'routing-controllers';
import {Container} from 'typedi';
import * as express from 'express';
import * as cors from 'cors';
import {LoggerInstance} from 'winston';
import {ApiFactory, LoggerFactory} from './utils';
import {Config} from './config';
import * as debug from 'debug';
import {IDebugger} from 'debug';
import {DataService} from './datasource/DataService';
import {TestData} from './testdata/testData';

// test push

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance       = this.loggerFactory.create('App');
  private debug: IDebugger             = debug('app:main');

  public async run(): Promise<void> {
    this.debug('express app');
    const app = express();
    app.use(cors());
    app.use(this.loggerFactory.requestLogger);
    process.setMaxListeners(0);
    this.debug('dependency injection');
    useContainer(Container);
    Container.set(ApiFactory, new ApiFactory(Config.settings.composer.url));
    Container.set(LoggerFactory, this.loggerFactory);
    Container.set(DataService, await this.initDataSource());
    setTimeout(() => {
      this.addTestData();
    }, 5000);

    const apiPath                                              = Config.settings.apiPath;
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix:         apiPath,
      controllers:         [`${__dirname}${apiPath}/*.js`]
    };

    this.debug('routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    this.debug('listen');
    app.listen(Config.settings.port, Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }

  private async initDataSource(): Promise<DataService> {
    const dataService: DataService = new DataService();
    this.logger.debug('[App]', 'Data service initialized');
    return dataService;
  }

  private async addTestData(): Promise<any> {
    return new TestData(Container.get(DataService), this.logger).addTestData()
      .catch((err: Error) => {
        throw new Error(err.message);
      });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
