import {ErrorType} from './ErrorType';
import {ErrorConfig} from './ErrorConfig';
import {CustomError} from './CustomError';

export class ErrorFactory {
  private static errorConfig: any;

  public static translate(errorType: ErrorType, errorObj?: Error): CustomError {
    const errorDefinition = ErrorConfig.errorConfig.errors[errorType] || this.errorConfig.errors.defaultError;

    let error: CustomError = new CustomError(ErrorFactory.formatErrorTypeMessage(errorType, errorDefinition.message));
    error.statusCode = errorDefinition.statusCode;

    error.message += errorObj ? errorObj.message : '';

    if (errorDefinition.includeStack && errorObj && error.stack) {
      error.stack = error.stack + errorObj.stack;
    }

    if (!ErrorConfig.errorConfig.genericConfig.includeStack) {
      error.stack = '';
    }

    return error;
  }

  private static formatErrorTypeMessage(errorType: ErrorType, errorMessage: string): string {
    return errorType + ': ' + errorMessage + ': ';
  }
}
