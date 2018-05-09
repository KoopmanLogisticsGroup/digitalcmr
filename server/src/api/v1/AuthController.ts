import {Container, Service} from 'typedi';
import {JsonController, Post, Body} from 'routing-controllers';
import {ClientAuthenticator, AuthenticationResponse} from '../../utils/authentication/ClientAuthenticator';
import {LoggerFactory} from '../../utils/logger';
import {LoggerInstance} from 'winston';
import {DataService} from '../../datasource/DataService';

class LoginParams {
  public username: string;
  public password: string;
}

@JsonController()
@Service()
export class AuthController {
  private logger: LoggerInstance   = Container.get(LoggerFactory).get('AuthController');
  private dataService: DataService = Container.get(DataService);

  @Post('/login')
  public async login(@Body() loginParams: LoginParams): Promise<AuthenticationResponse> {
    const clientAuthenticator = new ClientAuthenticator(
      this.logger,
      loginParams.username,
      loginParams.password,
      this.dataService
    );

    try {
      const authResponse: AuthenticationResponse = await clientAuthenticator.authenticate();

      if (!authResponse.success) {
        return Promise.reject(<AuthenticationResponse>{
          success: false,
          message: authResponse.message
        });
      }

      return Promise.resolve(<AuthenticationResponse>authResponse);
    } catch (error) {
      return Promise.reject(<AuthenticationResponse>{
        success: false,
        message: 'Server error occurred'
      });
    }
  }
}
