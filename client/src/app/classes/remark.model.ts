export class CarrierLoadingRemark {

  private _comments: string;
  private _isDamaged: boolean;

  public constructor(remark: any) {
    this._comments  = remark.comments;
    this._isDamaged = remark.isDamaged;
  }

  public get comments(): string {
    return this._comments;
  }

  public set comments(value: string) {
    this._comments = value;
  }

  public get isDamaged(): boolean {
    return this._isDamaged;
  }

  public set isDamaged(value: boolean) {
    this._isDamaged = value;
  }

  public toJSON(): any {
    return {
      'comments' : this.comments,
      'isDamaged': this.isDamaged
    };
  }
}
