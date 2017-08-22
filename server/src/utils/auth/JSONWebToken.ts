import {Request} from 'express';
import * as jwt from 'jsonwebtoken';

export class JSONWebToken {
  private decodedToken: any;

  public constructor(request: Request) {
    this.decodedToken = jwt.decode(JSONWebToken.getTokenFromRequest(request));
  }

  public getUsername(): string {
    return this.decodedToken ? this.decodedToken.username : null;
  }

  public getUserID(): string {
    return this.decodedToken ? this.decodedToken.userID : null;
  }

  public getUserRole(): string {
    return this.decodedToken ? this.decodedToken.role : null;
  }

  public getUserEmail(): string {
    return this.decodedToken ? this.decodedToken.userEmail : null;
  }

  public getSecret(): string {
    return this.decodedToken ? this.decodedToken.secret : null;
  }

  public static getTokenFromRequest(request: Request): string {
    let token = request.headers['x-access-token'];
    if (!token) {
      token = request.body ? request.body.token : null;
    }
    if (!token) {
      token = request.query ? request.query.token : null;
    }

    return token;
  }
}