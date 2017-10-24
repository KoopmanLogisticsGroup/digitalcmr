import {LoggerInstance} from 'winston';
import {UserAuthenticator} from './UserAuthenticator';
import {DataService} from '../../datasource/DataService';

export class ClientAuthenticator {
  public constructor(private logger: LoggerInstance,
                     private username: string,
                     private password: string,
                     private dataService: DataService) {
  }

  public async authenticate(): Promise<AuthenticationResponse> {
    this.logger.debug('Login attempt with username: ', this.username);

    try {
      const user = await this.dataService.getDocument('users', this.username);

      if (!new UserAuthenticator().validPassword(user, this.password)) {
        return <AuthenticationResponse>{
          success: false,
          message: 'Authentication failed. User or password is incorrect.'
        };
      }

      return <AuthenticationResponse>{
        success: true,
        token:   new UserAuthenticator().generateToken(user),
        user:    user
      };
    } catch (error) {
      return <AuthenticationResponse>{
        success: false,
        message: 'Authentication failed. User or password is incorrect. Reason: ' + error.message
      };
    }
  }
}

export interface AuthenticationResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}
