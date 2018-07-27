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
          includeStack: true
        },
        loginError: {
          message:     ErrorMessage.loginErrorMessage,
          includeStack: true
        },
        loginInvalidCredentialsError: {
          message:     ErrorMessage.loginInvalidCredentialsErrorMessage,
          includeStack: true
        },
        queryError: {
          message:     ErrorMessage.queryErrorMessage,
          includeStack: true
        },
        invokeError: {
          message:     ErrorMessage.invokeErrorMessage,
          includeStack: true
        },
        identityAddError: {
          message:     ErrorMessage.identityAddErrorMessage,
          includeStack: true
        }
      }
    };
  }
}