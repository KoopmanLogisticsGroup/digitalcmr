export enum ErrorMessage {
  defaultErrorMessage                 = 'Internal server error',
  loginErrorMessage                   = 'An error occurred during login',
  loginInvalidCredentialsErrorMessage = 'Invalid credentials',
  queryErrorMessage                   = 'An error occurred while executing the query',
  findOneErrorMessage                 = 'The asset with the specified ID could not be found',
  invokeErrorMessage                  = 'An error occurred while invoking the transaction',
  identityAddErrorMessage             = 'An error occurred while adding a new identity'
}