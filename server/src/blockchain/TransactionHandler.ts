import {TransactionCreator} from './TransactionCreator';
import {Factory} from 'composer-common';
import {Identity} from '../interfaces/entity.inferface';
import {Connection} from '../connections/entities/Connection';

export class TransactionHandler {
  public async invoke(identity: Identity, connection: Connection, namespace: string, transactionName: string, data: any, transactionCreator: TransactionCreator): Promise<void> {
    const factory: Factory = await connection.businessNetworkHandler.getFactory();

    const transaction = await transactionCreator.invoke(factory, namespace, transactionName, data, identity);
    await connection.businessNetworkHandler.submitTransaction(transaction);

    return connection.businessNetworkHandler.getSerializer(transaction);
  }

  public async query(identity: Identity, connection: Connection, queryName: string, parameters?: any): Promise<any[]> {
    const assets = await connection.businessNetworkHandler.query(queryName, parameters);

    return assets.map(asset => connection.businessNetworkHandler.getSerializer(asset));
  }

  public async findOne(identity: Identity, connection: Connection, queryName: string, parameters?: any): Promise<any> {
    const result = await this.query(identity, connection, queryName, parameters);

    if (!(result && result.length === 1)) {
      throw new Error(queryName + ':' + JSON.stringify(parameters));
    }

    return result[0];
  }
}
