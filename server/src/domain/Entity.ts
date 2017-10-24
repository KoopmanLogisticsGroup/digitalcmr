import {Identity} from './Identity';
import {UserApp} from './users/models/UserApp';

export class Entity {
  private _participant: any;
  private _identity: Identity;
  private _userApp: UserApp;
  private _supplier: any;

  public constructor(entity: any) {
    this._participant = entity.participant;
    this._identity    = entity.identity;
    this._userApp     = entity.userApp;
    this._supplier    = entity.supplier;
  }

  public get participant(): any {
    return this._participant;
  }

  public set participant(value: any) {
    this._participant = value;
  }

  public get identity(): Identity {
    return this._identity;
  }

  public set identity(value: Identity) {
    this._identity = value;
  }

  public get userApp(): UserApp {
    return this._userApp;
  }

  public set userApp(value: UserApp) {
    this._userApp = value;
  }

  public get supplier(): any {
    return this._supplier;
  }

  public set supplier(value: any) {
    this._supplier = value;
  }
}