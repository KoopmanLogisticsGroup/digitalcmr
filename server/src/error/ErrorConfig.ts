import {ErrorMessage} from './ErrorMessage';

export class ErrorConfig {
  public static get errorConfig(): any {
    return {
      genericConfig: {
        includeStack: true
      },
      errors: {
        defaultError: {
          message:     ErrorMessage.defaultErrorMessage,
          statusCode:    500,
          includeStack: true
        },
        loginError: {
          message:     ErrorMessage.loginErrorMessage,
          statusCode:    401,
          includeStack: true
        },
        loginInvalidCredentialsError: {
          message:     ErrorMessage.loginInvalidCredentialsErrorMessage,
          statusCode:    401,
          includeStack: true
        },
        queryError: {
          message:     ErrorMessage.queryErrorMessage,
          statusCode:    500,
          includeStack: true
        },
        findOneError: {
          message:     ErrorMessage.findOneErrorMessage,
          statusCode:    404,
          includeStack: true
        },
        invokeError: {
          message:     ErrorMessage.invokeErrorMessage,
          statusCode:    500,
          includeStack: true
        },
        identityAddError: {
          message:     ErrorMessage.identityAddErrorMessage,
          statusCode:    500,
          includeStack: true
        }
      }
    };
  }
}