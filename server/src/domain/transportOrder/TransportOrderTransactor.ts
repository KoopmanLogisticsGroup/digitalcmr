import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';

export class TransportOrderTransactor implements TransactionCreator {
  public async create(factory: Factory, namespace: string, data: any): Promise<any> {
    let transaction: any;

    if (Array.isArray(data)) {
      transaction                 = factory.newTransaction(namespace, 'CreateTransportOrders');
      transaction.transportOrders = await TransportOrderBuilder.buildTransportOrders(factory, namespace, data);
    } else {
      transaction                = factory.newTransaction(namespace, 'CreateTransportOrder');
      transaction.transportOrder = await  TransportOrderBuilder.buildTransportOrder(factory, namespace, data);
    }

    return transaction;
  }

  public async update(factory: Factory, namespace: string, data: any): Promise<any> {
    let transaction            = factory.newTransaction(namespace, 'UpdateTransportOrders');
    transaction.transportOrder = TransportOrderBuilder.buildTransportOrder(factory, namespace, data);

    return transaction;
  }

}