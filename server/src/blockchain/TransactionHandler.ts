import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import {TransactionCreator} from './TransactionCreator';
import {Identity} from '../domain/Identity';
import {Factory} from 'composer-common';

export class TransactionHandler {
  public constructor(private businessNetworkHandler: BusinessNetworkHandler) {
  }

  public async testConnection(identity: Identity, connectionProfile: string): Promise<void> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    await this.businessNetworkHandler.ping();

    return this.businessNetworkHandler.disconnect();
  }

  public async create(identity: Identity, connectionProfile: string, namespace: string, data: any, transactionCreator: TransactionCreator): Promise<void> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const factory: Factory = await this.businessNetworkHandler.getFactory();

    const transaction = transactionCreator.create(factory, namespace, data);

    await this.businessNetworkHandler.submitTransaction(transaction);

    return this.businessNetworkHandler.disconnect();
  }

  public async update(identity: Identity, connectionProfile: string, namespace: string, resource: any, resourceID: string, transactionCreator: TransactionCreator): Promise<void> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const factory: Factory = await this.businessNetworkHandler.getFactory();

    const transaction = transactionCreator.update(factory, namespace, resource, resourceID);

    await this.businessNetworkHandler.submitTransaction(transaction);

    return this.businessNetworkHandler.disconnect();
  }

  public async get(identity: Identity, connectionProfile: string, assetRegistry: string, resourceID: string): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const resourceAssetRegistry = await this.businessNetworkHandler.getAssetRegistry(assetRegistry);

    const rawResource = await resourceAssetRegistry.get(resourceID);
    await this.businessNetworkHandler.disconnect();

    return this.businessNetworkHandler.getSerializer(rawResource);
  }

  public async executeQuery(identity: Identity, connectionProfile: string, queryName: string, parameters?: any): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const assets = await this.businessNetworkHandler.query(queryName, parameters);

    const result: any[] = assets.map(asset => this.businessNetworkHandler.getSerializer(asset));

    await this.businessNetworkHandler.disconnect();

    return result.length > 1 ? result : result[0];
  }
}
