import {Response} from 'express';
import * as winston from 'winston';
import {Service} from 'typedi';
import {JsonController, Post, Res, Body, Req} from 'routing-controllers';
import {ClientAuthenticator, AuthenticationResponse} from '../../utils/auth/ClientAuthenticator';
import {LoggerFactory} from '../../utils/logger/LoggerFactory';
import {DataService} from '../../datasource/DataService';

class LoginParams {
  public username: string;
  public password: string;
}

@JsonController()
@Service()
export class AuthController {
  private logger: winston.LoggerInstance;

  public constructor(loggerFactory: LoggerFactory,
                     private dataService: DataService) {
    this.logger = loggerFactory.create();
  }

  @Post('/login')
  public async login(@Body() loginParams: LoginParams, @Res() response: Response): Promise<AuthenticationResponse> {
    let clientAuthenticator = new ClientAuthenticator(
      this.logger,
      loginParams.username,
      loginParams.password,
      this.dataService
    );

    try {
      return clientAuthenticator.authenticate();
    } catch (error) {
      return Promise.reject(<AuthenticationResponse>{
        success: false,
        message: 'Server error occurred'
      });
    }
  }
}
