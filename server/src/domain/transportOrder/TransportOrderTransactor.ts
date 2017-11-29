import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {Transaction} from '../../blockchain/Transactions';
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../Identity';
import {Query} from '../../blockchain/Queries';

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
      transaction.dateWindow.startDate = data.dateWindow[0];
      transaction.dateWindow.endDate   = data.dateWindow[1];
      transaction.vin                  = data.vin;
    } else if (transactionName === Transaction.UpdateTransportOrderStatusToCanceled) {
      transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
      transaction.reason         = data.reason;
    }

    return transaction;
  }

  public async getAllTransportOrdersByVin(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, vin: string): Promise<any> {
    const transportOrders = await transactionHandler.executeQuery(identity, connectionProfile, QueryReturnType.Multiple, Query.GetAllTransportOrders);

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
