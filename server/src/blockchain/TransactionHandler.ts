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

  public async query(identity: Identity, connectionProfile: string, queryReturnType: QueryReturnType, queryName: string, parameters?: any): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);
    const assets = await this.businessNetworkHandler.query(queryName, parameters);

    let result: any[] = assets.map(asset => this.businessNetworkHandler.getSerializer(asset));

    await this.businessNetworkHandler.disconnect();

    return (queryReturnType === QueryReturnType.Single) ? ((!result.length || typeof result === 'undefined') ? {} : result[0]) : result;
  }
}
