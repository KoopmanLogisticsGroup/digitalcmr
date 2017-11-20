import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {TransportOrder} from '../../../resources/interfaces/transportOrder.interface';

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

  public update(factory: Factory, namespace: string, data: any): Promise<any> {
    let transaction            = factory.newTransaction(namespace, 'UpdateTransportOrder');
    transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data[0].orderID);
    transaction.ecmrs          = [];

    for (let ecmr of data) {
      transaction.ecmrs.push(factory.newRelationship(namespace, 'ECMR', ecmr));
    }
    return transaction;
  }
}
