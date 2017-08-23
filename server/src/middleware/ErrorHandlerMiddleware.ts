import {Middleware, ErrorMiddlewareInterface} from 'routing-controllers';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {LoggerInstance} from 'winston';

@Middleware()
export class ErrorHandlerMiddleware implements ErrorMiddlewareInterface {
  private logger: LoggerInstance = Container.get(LoggerFactory).create('Request Error');

  public error(error: any, request: any, response: any, next: (err: any) => any): void {
    console.log('error', error);
    if (error.body && error.body.error) {
      error = error.body.error;
    }
    if (typeof error === 'string') {
      error = new Error(error);
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    this.logger.debug(error.message);
    response.status(error.statusCode).send({
       message: error.message
    });
  }
}