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

    let user: any;
    try {
      let result = await this.dataService.getDocuments([this.username]);
      user       = result[0];
      if (!new UserAuthenticator().validPassword(user, this.password)) {
        return <AuthenticationResponse>{
          success: false,
          message: 'Authentication failed. User or password is incorrect.'
        };
      }

      return <AuthenticationResponse>{
        success: true,
        token:   new UserAuthenticator().generateToken(user),
        user:    {
          userID: user.userID,
          username: user.username,
          userEmail: user.userEmail,
          role: user.role
        }
      };
    } catch (error) {
      return <AuthenticationResponse>{
        success: false,
        message: 'Authentication failed. User or password is incorrect.'
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