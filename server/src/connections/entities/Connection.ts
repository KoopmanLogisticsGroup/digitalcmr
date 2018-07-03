import {Factory} from 'composer-common';
import {BusinessNetworkHandler} from '../../blockchain/BusinessNetworkHandler';

export class Connection {
  private createdTs: number;

  public constructor(private _businessNetworkHandler: BusinessNetworkHandler,
                     private _factory: Factory,
                     private _serializer: any) {
    this.createdTs = new Date().getTime();
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

  public getCreatedTs(): number {
    return this.createdTs;
  }
}
