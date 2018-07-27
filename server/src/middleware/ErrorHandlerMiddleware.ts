import {Middleware, ExpressErrorMiddlewareInterface} from 'routing-controllers';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {LoggerInstance} from 'winston';

@Middleware({type: 'after'})
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  private logger: LoggerInstance = Container.get(LoggerFactory).get('RequestErrorHandler');

  public error(error: any, request: any, response: any, next: (err: any) => any): void {
    this.logger.error(error);
    response.statusCode = 500;

    let responseObj: any = {};
    responseObj.error    = {};

    responseObj.error.message = error.message;

    if (error.stack) {
      responseObj.error.stack = error.stack;
    }

    response.json(responseObj);
  }
}
