import {Address} from './address.model';

export class Participant {

  private _$class: string;
  private _org: string;
  private _userID: string;
  private _password: string;
  private _userName: string;
  private _firstName: string;
  private _lastName: string;
  private _address: Address;

  public constructor(participant: any) {
    this._$class    = participant.$class;
    this._org       = participant.org;
    this._userID    = participant.userID;
    this._password  = participant.password;
    this._userName  = participant.userName;
    this._firstName = participant.firstName;
    this._lastName  = participant.lastName;
    this._address   = new Address(participant.address);
  }

  public get $class(): string {
    return this._$class;
  }

  public set $class(value: string) {
    this._$class = value;
  }

  public get org(): string {
    return this._org;
  }

  public set org(value: string) {
    this._org = value;
  }

  public get userID(): string {
    return this._userID;
  }

  public set userID(value: string) {
    this._userID = value;
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
  }

  public get userName(): string {
    return this._userName;
  }

  public set userName(value: string) {
    this._userName = value;
  }

  public get firstName(): string {
    return this._firstName;
  }

  public set firstName(value: string) {
    this._firstName = value;
  }

  public get lastName(): string {
    return this._lastName;
  }

  public set lastName(value: string) {
    this._lastName = value;
  }

  public get address(): Address {
    return this._address;
  }

  public set address(value: Address) {
    this._address = value;
  }

  public toJSON(): any {
    return {
      '$class':    this._$class,
      'org':       this._org,
      'userID':    this._userID,
      'password':  this._password,
      'userName':  this._userName,
      'firstName': this._firstName,
      'lastName':  this._lastName,
      'address':   this._address.toJSON()
    };
  }
}