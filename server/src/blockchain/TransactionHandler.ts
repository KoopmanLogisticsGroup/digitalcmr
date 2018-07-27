import {TransactionCreator} from './TransactionCreator';
import {Factory} from 'composer-common';
import {Identity} from '../interfaces/entity.inferface';
import {Connection} from '../connections/entities/Connection';

export enum QueryReturnType {
  Multiple,
  Single
}

export class TransactionHandler {
  public async invoke(identity: Identity, connection: Connection, connectionProfile: string, namespace: string, transactionName: string, data: any, transactionCreator: TransactionCreator): Promise<void> {
    const factory: Factory = await connection.businessNetworkHandler.getFactory();

    const transaction = await transactionCreator.invoke(factory, namespace, transactionName, data, identity);
    await connection.businessNetworkHandler.submitTransaction(transaction);

    return connection.businessNetworkHandler.getSerializer(transaction);
  }

  public async query(identity: Identity, connection: Connection, connectionProfile: string, queryReturnType: QueryReturnType, queryName: string, parameters?: any): Promise<any> {
    const assets = await connection.businessNetworkHandler.query(queryName, parameters);

    let result: any[] = assets.map(asset => connection.businessNetworkHandler.getSerializer(asset));

    return (queryReturnType === QueryReturnType.Single) ? ((!result.length || typeof result === 'undefined') ? {} : result[0]) : result;
  }
}
