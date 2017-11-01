import {Identity} from './Identity';
import {UserApp} from './users/models/UserApp';

export class Entity {
  public participant: any;
  public identity: Identity;
  public userApp: UserApp;

  public constructor(entity: any) {
    this.participant = entity.participant;
    this.identity    = entity.identity;
    this.userApp     = entity.userApp;
  }
}
