import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';

export class TransportOrderTransactor implements TransactionCreator {
  public async invoke(factory: Factory, namespace: string, transactionName: string, data: any): Promise<any> {
    let transaction             = factory.newTransaction(namespace, transactionName);
    transaction.transportOrders = await TransportOrderBuilder.buildTransportOrders(factory, namespace, data);

    return transaction;
  }
}
