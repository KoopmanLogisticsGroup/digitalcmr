import {Factory} from 'composer-common';
import {BusinessNetworkHandler} from '../../blockchain/BusinessNetworkHandler';

export class Connection {
  private lastUsedTs: number;

  public constructor(private _businessNetworkHandler: BusinessNetworkHandler,
                     private _factory: Factory,
                     private _serializer: any) {
    this.resetInactivityTimer();
  }

  public get businessNetworkHandler(): BusinessNetworkHandler {
    return this._businessNetworkHandler;
  }

  public get factory(): Factory {
    return this._factory;
  }

  public get serializer(): any {
    return this._serializer;
  }

  public resetInactivityTimer(): void {
    this.lastUsedTs = new Date().getTime();
  }

  public getInactivityTime(): number {
    return new Date().getTime() - this.lastUsedTs;
  }
}
