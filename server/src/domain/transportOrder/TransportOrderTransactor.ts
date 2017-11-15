import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {Identity} from '../Identity';

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
    transaction.transportOrder = TransportOrderBuilder.buildTransportOrder(factory, namespace, data);

    return transaction;
  }

  public async updatePickupWindow(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, namespace: string, orderID: string, vin: string, pickupWindow: any): Promise<any> {
    let transportOrder = await transactionHandler.executeQuery(identity, connectionProfile, 'getTransportOrderById', {orderID: orderID});
    for (let goodIndex = 0; goodIndex < transportOrder.goods.length; goodIndex++) {
      let good = transportOrder.goods[goodIndex];
      if (good.vehicle.vin === vin) {
        good.loadingStartDate = parseInt(pickupWindow.window[0]);
        good.loadingEndDate   = parseInt(pickupWindow.window[1]);
      }
      transportOrder.goods[goodIndex] = good;
    }
    return await transactionHandler.update(identity, connectionProfile, namespace, transportOrder, transportOrder.orderID, new TransportOrderTransactor());
  }
}
