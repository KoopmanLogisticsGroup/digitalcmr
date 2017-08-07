'use strict';

import * as crypto from 'crypto';
import {Password} from '../utils/auth/Password';

export class User {
  private _userID: string;
  private _salt: string;
  private _hash: string;
  private _username: string;

  public constructor(user: any) {
    this._userID   = user.userID;
    this._username = user.username;
    this._salt     = crypto.randomBytes(16).toString('hex');
    this._hash     = new Password(user.password, this.salt).toHash();
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

  public toJSON(): any {
    return {
      'userID':   this.userID,
      'salt':     this.salt,
      'hash':     this.hash,
      'username': this.username
    };
  }
}