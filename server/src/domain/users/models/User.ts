import * as crypto from 'crypto';
import {Password} from '../../../utils/authentication/Password';

export class User {
  private _userID: string;
  private _salt: string;
  private _hash: string;
  private _username: string;
  private _org: string;
  private _userEmail: string;
  private _role: string;
  private _secret: string;

  public constructor(user: any) {
    this._userID    = user.userID;
    this._username  = user.username;
    this._salt      = crypto.randomBytes(16).toString('hex');
    this._hash      = new Password(user.password, this.salt).toHash();
    this._org       = user.org;
    this._userEmail = user.userEmail;
    this._role      = user.role;
    this._secret    = user.secret;
  }

  public get org(): string {
    return this._org;
  }

  public get userEmail(): string {
    return this._userEmail;
  }

  public get userID(): string {
    return this._userID;
  }

  public get salt(): string {
    return this._salt;
  }

  public get hash(): string {
    return this._hash;
  }

  public get username(): string {
    return this._username;
  }

  public get role(): string {
    return this._role;
  }

  public get secret(): string {
    return this._secret;
  }

  public toJSON(): any {
    return {
      'userID':    this.userID,
      'salt':      this.salt,
      'hash':      this.hash,
      'username':  this.username,
      'org':       this.org,
      'userEmail': this.userEmail,
      'role':      this.role,
      'secret':    this.secret
    };
  }
}