import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {Transaction} from '../../blockchain/Transactions';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Query} from '../../blockchain/Queries';
import {Identity} from '../../interfaces/entity.inferface';
import {Connection} from '../../connections/entities/Connection';

export class TransportOrderTransactor implements TransactionCreator {
  public async invoke(factory: Factory, namespace: string, transactionName: string, data: any): Promise<any> {
    let transaction = factory.newTransaction(namespace, transactionName);

    if (transactionName === Transaction.CreateTransportOrder) {
      transaction.transportOrder = await TransportOrderBuilder.buildTransportOrder(factory, namespace, data);
    } else if (transactionName === Transaction.CreateTransportOrders) {
      transaction.transportOrders = await TransportOrderBuilder.buildTransportOrders(factory, namespace, data);
    } else if (transactionName === Transaction.UpdateTransportOrder) {
      transaction.transportOrder = TransportOrderBuilder.buildTransportOrder(factory, namespace, data);
    } else if ((transactionName === Transaction.UpdateTransportOrderPickupWindow) || (transactionName === Transaction.UpdateTransportOrderDeliveryWindow)) {
      transaction.transportOrder       = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
      transaction.dateWindow           = factory.newConcept(namespace, 'DateWindow', data.pickupWindow);
      transaction.dateWindow.startDate = data.dateWindow.startDate;
      transaction.dateWindow.endDate   = data.dateWindow.endDate;
      transaction.vin                  = data.vin;
    } else if (transactionName === Transaction.UpdateTransportOrderStatusToCancelled) {
      transaction.transportOrder           = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
      transaction.cancellation             = factory.newConcept(namespace, 'Cancellation');
      transaction.cancellation.cancelledBy = factory.newRelationship(namespace, 'Entity', data.cancellation.cancelledBy);
      transaction.cancellation.date        = data.cancellation.date;
      transaction.cancellation.reason      = data.cancellation.reason;
    }

    return transaction;
  }

  public async getAllTransportOrdersByVin(transactionHandler: TransactionHandler, identity: Identity, connection: Connection, vin: string): Promise<any> {
    const transportOrders = await transactionHandler.query(identity, connection, Query.GetAllTransportOrders);

    let transportOrderArray: any = [];

    for (let transportOrder of transportOrders) {
      for (let good of transportOrder.goods) {
        if (good.vehicle.vin === vin) {
          transportOrderArray.push(transportOrder);
        }
      }
    }
    return transportOrderArray;
  }
}
