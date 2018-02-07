import {Request} from 'express';
import * as jwt from 'jsonwebtoken';
import {Identity} from '../../interfaces/entity.inferface';

export class JSONWebToken {
  private decodedToken: any;

  public constructor(request: Request) {
    this.decodedToken = jwt.decode(JSONWebToken.getTokenFromRequest(request));
  }

  public getIdentity(): Identity {
    return this.decodedToken ? this.decodedToken.identity : <Identity>{};
  }

  public static getTokenFromRequest(request: Request): string {
    let token = request.headers['x-access-token'] as string;
    if (!token) {
      token = request.body ? request.body.token : null;
    }
    if (!token) {
      token = request.query ? request.query.token : null;
    }

    return token;
  }
}