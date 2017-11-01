import * as crypto from 'crypto';
import {Identity} from '../../Identity';
import {Password} from '../../../utils/authentication/Password';

export class UserApp {
  public username: string;
  public salt: string;
  public hash: string;
  public firstName: string;
  public lastName: string;
  public role: string;
  public identity: Identity;

  public constructor(user: any) {
    this.username  = user.username;
    this.salt      = crypto.randomBytes(16).toString('hex');
    this.hash      = new Password(user.password, this.salt).toHash();
    this.firstName = user.firstName;
    this.lastName  = user.lastName;
    this.role      = user.role;
    this.identity  = user.identity;
  }
}
