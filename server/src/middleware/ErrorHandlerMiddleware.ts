import {Middleware, ErrorMiddlewareInterface} from 'routing-controllers';

@Middleware()
export class ErrorHandlerMiddleware implements ErrorMiddlewareInterface {
  public error(error: any, request: any, response: any, next: (err: any) => any): void {
    if (error.body && error.body.error) {
      error = error.body.error;
    }
    if (typeof error === 'string') {
      error = new Error(error);
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    response.status(error.statusCode).send({
       'message': error.message
    });
  }
}