import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {Identity} from '../Identity';
import {EcmrTransactor} from '../ecmrs/EcmrTransactor';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
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
    transaction.transportOrder = TransportOrderBuilder.buildTransportOrder(factory, namespace, data);

    return transaction;
  }

  public async createECMRFromTransportOrder(identity: Identity, connectionProfile: string, namespace: string, ecmrFromTransportOrder: any, transportOrder: TransportOrder, transactionHandler: TransactionHandler): Promise<any> {
    await transactionHandler.create(identity, connectionProfile, namespace, ecmrFromTransportOrder, new EcmrTransactor());
    for (const ecmr of ecmrFromTransportOrder) {
      transportOrder.ecmrs.push(ecmr.ecmrID);
    }

    return await transactionHandler.update(identity, connectionProfile, namespace, transportOrder, transportOrder.orderID, new TransportOrderTransactor());
  }
}
