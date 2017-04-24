import {MiddlewareGlobalAfter, ErrorMiddlewareInterface} from 'routing-controllers';

@MiddlewareGlobalAfter()
export class ErrorHandlerMiddleware implements ErrorMiddlewareInterface {
  public error(error: any, request: any, response: any, next: (err: any) => any): void {
    if (error.body && error.body.error) {
      error = error.body.error;
    }
    response.status(error.statusCode).send({
      'message': error.message
    });

    next(error);
  }
}