import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import {TransactionCreator} from './TransactionCreator';
import {Identity} from '../domain/Identity';
import {Factory} from 'composer-common';

export enum QueryReturnType {
  Multiple,
  Single
}

export class TransactionHandler {
  public constructor(private businessNetworkHandler: BusinessNetworkHandler) {
  }

  public async invoke(identity: Identity, connectionProfile: string, namespace: string, transactionName: string, data: any, transactionCreator: TransactionCreator): Promise<void> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const factory: Factory = await this.businessNetworkHandler.getFactory();

    const transaction = await transactionCreator.invoke(factory, namespace, transactionName, data);

    try {
      await this.businessNetworkHandler.submitTransaction(transaction);
    } catch (error) {
      throw error;
    }

    return this.businessNetworkHandler.disconnect();
  }

  public async get(identity: Identity, connectionProfile: string, assetRegistry: string, resourceID: string): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const resourceAssetRegistry = await this.businessNetworkHandler.getAssetRegistry(assetRegistry);

    const rawResource = await resourceAssetRegistry.get(resourceID);
    await this.businessNetworkHandler.disconnect();

    return this.businessNetworkHandler.getSerializer(rawResource);
  }

  public async executeQuery(identity: Identity, connectionProfile: string, queryReturnType: QueryReturnType, queryName: string, parameters?: any): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const assets = await this.businessNetworkHandler.query(queryName, parameters);

    const result: any[] = assets.map(asset => this.businessNetworkHandler.getSerializer(asset));

    await this.businessNetworkHandler.disconnect();

    return (queryReturnType === QueryReturnType.Single && result.length === 1) ? result[0] : result;
  }
}
