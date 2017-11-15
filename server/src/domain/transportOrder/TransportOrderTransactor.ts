import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {TransportOrderBuilder} from './TransportOrderBuilder';
import {Identity} from '../Identity';
import {EcmrTransactor} from '../ecmrs/EcmrTransactor';
import {Config} from '../../config/index';
import {TransactionHandler} from '../../blockchain/TransactionHandler';

export class TransportOrderTransactor implements TransactionCreator {
  public async create(factory: Factory, namespace: string, data: any, enrollmentID: string): Promise<any> {
    let transaction: any;

    if (Array.isArray(data)) {
      transaction                 = factory.newTransaction(namespace, 'CreateTransportOrders');
      transaction.transportOrders = await TransportOrderBuilder.buildTransportOrders(factory, namespace, data, enrollmentID);
    } else {
      transaction                = factory.newTransaction(namespace, 'CreateTransportOrder');
      transaction.transportOrder = await  TransportOrderBuilder.buildTransportOrder(factory, namespace, data, enrollmentID);
    }

    return transaction;
  }

  public update(factory: Factory, namespace: string, data: any, enrollmentID: string): Promise<any> {
    let transaction            = factory.newTransaction(namespace, 'UpdateTransportOrder');
    transaction.transportOrder = TransportOrderBuilder.buildTransportOrder(factory, namespace, data, enrollmentID);

    return transaction;
  }

  public async createECMRFromTransportOrder(identity: Identity, connectionProfile: string, namespace: string, ecmrFromTransportOrder: any, resource: any, resourceID: any, transactionHandler: TransactionHandler): Promise<any> {
    await transactionHandler.create(identity, connectionProfile, namespace, ecmrFromTransportOrder, new EcmrTransactor());
    return await transactionHandler.update(identity, connectionProfile, namespace, resource, resourceID, new TransportOrderTransactor());
  }
}
