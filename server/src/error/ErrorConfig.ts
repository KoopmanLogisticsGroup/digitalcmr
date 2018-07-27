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
          message:     ErrorMessage.queryError,
          includeStack: true
        },
        invokeError: {
          message:     ErrorMessage.invokeError,
          includeStack: true
        }
      }
    };
  }
}