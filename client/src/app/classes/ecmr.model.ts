export class Ecmr {

  private _carrierComments: string;

  public constructor() {
  }

  public get carrierComments(): string {
    return this._carrierComments;
  }

  public set carrierComments(value: string) {
    this._carrierComments = value;
  }

  public toJSON(): {} {
    return {
      'carrierComments': this.carrierComments,
    };
  }
}
