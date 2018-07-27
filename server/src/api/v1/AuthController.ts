import {Container, Service} from 'typedi';
import {JsonController, Post, Body} from 'routing-controllers';
import {ClientAuthenticator, AuthenticationResponse} from '../../utils/authentication/ClientAuthenticator';
import {LoggerFactory} from '../../utils/logger';
import {LoggerInstance} from 'winston';
import {DataService} from '../../datasource/DataService';
import {Identity} from '../../interfaces/entity.inferface';
import {ConnectionPoolManager} from '../../connections/ConnectionPoolManager';
import {ConnectionFactory} from '../../connections/ConnectionFactory';
import {ErrorFactory} from '../../error/ErrorFactory';
import {ErrorType} from '../../error/ErrorType';

class LoginParams {
  public username: string;
  public password: string;
}

@JsonController()
@Service()
export class AuthController {
  private logger: LoggerInstance                       = Container.get(LoggerFactory).get('AuthController');
  private dataService: DataService                     = Container.get(DataService);
  private connectionPoolManager: ConnectionPoolManager = Container.get(ConnectionPoolManager);
  private connectionFactory: ConnectionFactory         = Container.get(ConnectionFactory);

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
        throw(ErrorFactory.translate(ErrorType.loginInvalidCredentialsError, new Error(authResponse.message)));
      }

      const identity: Identity = authResponse.user.identity;

      if (!this.connectionPoolManager.userHasConnection(identity.userID)) {
        const connection = await this.connectionFactory.create(identity);
        this.connectionPoolManager.addConnection(identity.userID, connection);
      }

      return Promise.resolve(<AuthenticationResponse>authResponse);
    } catch (error) {
      throw(ErrorFactory.translate(ErrorType.loginError, error));
    }
  }
}
