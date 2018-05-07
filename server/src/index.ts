import 'reflect-metadata';
import {RoutingControllersOptions, useContainer, useExpressServer} from 'routing-controllers';
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
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

const forceSSL = require('express-force-ssl');

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance       = this.loggerFactory.get('App');
  private debug: IDebugger             = debug('app:main');
  private isTLSEnabled: boolean        = process.env.TLS === 'true';
  private isInitRequired: boolean      = process.env.INIT === 'true';
  private routingControllersOptions: RoutingControllersOptions;

  public async run(): Promise<void> {
    this.debug('starting express app');
    const app: Application = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(this.loggerFactory.requestLogger);
    app.set('forceSSLOptions', {
      enable301Redirects: true,
      trustXFPHeader:     false,
      httpsPort:          443,
      sslRequiredMessage: 'SSL Required, Please make sure you are using HTTPS.'
    });

    this.debug('dependency injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);
    Container.set(DataService, new DataService());
    Container.set(BusinessNetworkHandler, new BusinessNetworkHandler(new ComposerClient.BusinessNetworkConnection()));
    Container.set(TransactionHandler, new TransactionHandler(Container.get(BusinessNetworkHandler)));
    Container.set(IdentityManager, new IdentityManager(Config.settings.composer.namespace));

    if (process.env.NODE_ENV!.indexOf('kpm') !== -1 || process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development') {
      await new TestData(Container.get(TransactionHandler),
        Container.get(DataService),
        Container.get(IdentityManager)).addAdmin(<UserInfo> {
        username:  'admin',
        password:  '@dm1nPassw0rd',
        firstName: 'admin',
        lastName:  'admin',
        role:      'admin'
      });
    } else if (process.env.NODE_ENV!.indexOf('pon') !== -1) {
      await new TestData(Container.get(TransactionHandler),
        Container.get(DataService),
        Container.get(IdentityManager)).addAdmin(<UserInfo> {
        username:  'adminPon',
        password:  '@dm1nPassw0rd',
        firstName: 'adminPon',
        lastName:  'adminPon',
        role:      'adminPon'
      });
    } else if (process.env.NODE_ENV!.indexOf('all') !== -1) {
      await new TestData(Container.get(TransactionHandler),
        Container.get(DataService),
        Container.get(IdentityManager)).addAdmin(<UserInfo> {
        username:  'adminAll',
        password:  '@dm1nPassw0rd',
        firstName: 'adminAll',
        lastName:  'adminAll',
        role:      'adminAll'
      });
    }

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

    if (this.isTLSEnabled) {
      this.setupHTTPSSecureServer(app);
    } else {
      this.setupHTTPServer(app);
    }

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }

  private setupHTTPServer(app: any): void {
    useExpressServer(app, this.routingControllersOptions);

    http.createServer(app).listen(Config.settings.port as number, Config.settings.host);
    this.logger.info(`TSL disabled - API at http://${Config.settings.host}:${Config.settings.port}${Config.settings.apiPath}`);
  }

  private setupHTTPSSecureServer(app: any): void {
    let credentials = {
      key:                fs.readFileSync('./resources/tls/kpm-pon-app/server-key.pem'),
      cert:               fs.readFileSync('./resources/tls/kpm-pon-app/server-crt.pem'),
      ca:                 fs.readFileSync('./resources/tls/kpm-pon-app/ca-cert.pem'),
      passphrase:         'C5C9dVXTp8Ka4q',
      requestCert:        true,
      rejectUnauthorized: true
    };

    app.use(forceSSL);
    useExpressServer(app, this.routingControllersOptions);

    http.createServer(app).listen(Config.settings.port as number, Config.settings.host);
    https.createServer(credentials, app).listen(443, Config.settings.host);
    this.logger.info(`TLS enabled - API at https://${Config.settings.host}${Config.settings.apiPath}`);
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
