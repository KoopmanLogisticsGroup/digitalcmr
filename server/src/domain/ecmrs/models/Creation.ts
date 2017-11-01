import {Address} from '../../participants/models/Address';

export class Creation {
  public address: Address;
  public date: number;

  public constructor(creation: any) {
    this.address = creation.address;
    this.date    = creation.date;
  }
}