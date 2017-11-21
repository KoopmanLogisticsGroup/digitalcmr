import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {Transaction} from '../../blockchain/Transactions';

export class TransportOrderTransactor implements TransactionCreator {
  public async invoke(factory: Factory, namespace: string, transactionName: string, data: any): Promise<any> {
    let transaction = factory.newTransaction(namespace, transactionName);

    if (transactionName === Transaction.CreateTransportOrder) {
      transaction.transportOrder = await TransportOrderBuilder.buildTransportOrder(factory, namespace, data);
    } else if (transactionName === Transaction.CreateTransportOrders) {
      transaction.transportOrders = await TransportOrderBuilder.buildTransportOrders(factory, namespace, data);
    } else if (transactionName === Transaction.UpdateTransportOrder) {
      transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data[0].orderID);
      transaction.ecmrs          = [];

      for (let ecmr of data) {
        transaction.ecmrs.push(factory.newRelationship(namespace, 'ECMR', ecmr));
      }
    } else if (transactionName === Transaction.UpdateTransportOrderStatusToCompleted) {
      transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
      console.log(transaction);
    }

    return transaction;
  }
}
