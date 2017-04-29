import 'reflect-metadata';
import {useExpressServer, useContainer} from 'routing-controllers';
import {Container} from 'typedi';
import {Request, Response} from 'express';
import * as morgan from 'morgan';
import * as express from 'express';
import * as winston from 'winston';
import * as cors from 'cors';
import {LoggerFactory, ApiFactory} from './utils';

// Global middleware needs to be imported to be registered automatically
import {ErrorHandlerMiddleware, ComposerInterceptor} from './middleware';
import {Config} from './config/index';

class App {
  private logger: winston.LoggerInstance = new LoggerFactory().create();

  public async run(): Promise<void> {
    const app = express();
    app.use(cors());

    // Dependency injection
    useContainer(Container);
    Container.set(LoggerFactory, new LoggerFactory());
    Container.set(ApiFactory, new ApiFactory(Config.settings.composer.url));

    // initialize routing
    useExpressServer(app, {
      defaultErrorHandler : false,
      routePrefix: '/api/v1',
      controllers: [__dirname + '/api/v1/*.js']
    });

    // Log requests
    app.use(morgan('dev', <morgan.Options> {
      stream: {
        skip:  (request: Request, response: Response) => response.statusCode < 400,
        write: (message: string): void => {
          this.logger.debug(message);
        }
      }
    }));

    // Start server
    const port = (process.env.VCAP_PORT || process.env.PORT || 8080);
    const host = (process.env.VCAP_HOST || process.env.HOST || 'localhost');
    app.listen(port);
    this.logger.info(`[App] Express server listening at http://${host}:${port}`);
  }
}

process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
  this.logger.error('Unhandled rejection', error.stack);
});

new App().run();