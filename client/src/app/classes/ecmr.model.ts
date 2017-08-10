export class Ecmr {
  private _ecmrID: string;

  public constructor(private _status: string,
                     private _owner: string) {
  }


  public get ecmrID(): string {
    return this._ecmrID;
  }


  public get status(): string {
    return this._status;
  }

  public get owner(): string {
    return this._owner;
  }

  public toJSON(): any {
    return {
      'ecmrID': this.ecmrID,
      'status': this.status,
      'owner': this.owner,
    };
  }
}
