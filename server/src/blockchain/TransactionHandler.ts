import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import {TransactionCreator} from './TransactionCreator';
import {Factory} from 'composer-common';
import {Identity} from '../interfaces/entity.inferface';

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

    const transaction = await transactionCreator.invoke(factory, namespace, transactionName, data, identity);

    try {
      await this.businessNetworkHandler.submitTransaction(transaction);
    } catch (error) {
      throw error;
    }

    await this.businessNetworkHandler.disconnect();

    return this.businessNetworkHandler.getSerializer(transaction);
  }

  public async get(identity: Identity, connectionProfile: string, assetRegistry: string, resourceID: string): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const resourceAssetRegistry = await this.businessNetworkHandler.getAssetRegistry(assetRegistry);

    const rawResource = await resourceAssetRegistry.get(resourceID);
    await this.businessNetworkHandler.disconnect();

    return this.businessNetworkHandler.getSerializer(rawResource);
  }

  public async query(identity: Identity, connectionProfile: string, queryReturnType: QueryReturnType, queryName: string, parameters?: any): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const assets = await this.businessNetworkHandler.query(queryName, parameters);

    const result: any[] = assets.map(asset => this.businessNetworkHandler.getSerializer(asset));

    await this.businessNetworkHandler.disconnect();

    return (queryReturnType === QueryReturnType.Single) ? result[0] : result;
  }
}
