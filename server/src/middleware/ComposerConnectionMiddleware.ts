import {JSONWebToken} from '../utils/authentication/JSONWebToken';
import {Identity} from '../interfaces/entity.inferface';
import {Connection} from '../connections/entities/Connection';
import {Container} from 'typedi';
import {ConnectionPoolManager} from '../connections/ConnectionPoolManager';

export class ComposerConnectionMiddleware {
  private connectionPoolManager: ConnectionPoolManager = Container.get(ConnectionPoolManager);

  public use(request: any, response: any, next: (err?: any) => any): any {
      request.identity = <Identity>new JSONWebToken(request).getIdentity();
      request.connection = <Connection>this.connectionPoolManager.getConnection(request.identity.userID);
      next();
  }
}
