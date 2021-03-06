import {Config} from '../config';
import * as jwt from 'jsonwebtoken';
import {JSONWebToken} from '../utils/authentication/JSONWebToken';
import {AuthenticationResponse} from '../utils/authentication/ClientAuthenticator';

export class UserAuthenticatorMiddleware {
  public use(request: any, response: any, next: (err?: any) => any): any {
    let token = JSONWebToken.getTokenFromRequest(request);

    if (!token) {
      return this.failAuthentication(response, 'No token provided.');
    }

    jwt.verify(token, Config.settings.serverSecret!, (err: any, decoded: any) => {
      if (err) {
        return this.failAuthentication(response, 'Failed to authenticate token.');
      }
      next();
    });
  }

  private failAuthentication(response: any, message: string): void {
    response.status(401).json(<AuthenticationResponse>{
      success: false,
      message: message
    });
  }
}
