import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {EcmrBuilder} from './EcmrBuilder';
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';
import {Transaction} from '../../blockchain/Transactions';
import {Query} from '../../blockchain/Queries';
import {Identity} from '../../interfaces/entity.inferface';
import {Connection} from '../../connections/entities/Connection';

export class EcmrTransactor implements TransactionCreator {
  public async invoke(factory: Factory, namespace: string, transactionName: string, data: any, identity: Identity): Promise<any> {
    let transaction = factory.newTransaction(namespace, transactionName);

    if (transactionName === Transaction.CreateEcmrs) {
      transaction.ecmrs          = await EcmrBuilder.buildECMRs(factory, namespace, data.ecmrs, identity);
      transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
    } else if (transactionName === Transaction.UpdateEcmrStatusToLoaded || transactionName === Transaction.UpdateEcmrStatusToInTransit) {
      transaction.ecmr      = factory.newRelationship(namespace, 'ECMR', data.ecmrID);
      transaction.goods     = EcmrBuilder.buildGoods(factory, namespace, data.goods);
      transaction.signature = EcmrBuilder.buildSignature(factory, namespace, data.signature, identity);
    } else if (transactionName === Transaction.UpdateEcmrStatusToDelivered || transactionName === Transaction.UpdateEcmrStatusToConfirmedDelivered) {
      transaction.ecmr           = factory.newRelationship(namespace, 'ECMR', data.ecmrID);
      transaction.goods          = EcmrBuilder.buildGoods(factory, namespace, data.goods);
      transaction.signature      = EcmrBuilder.buildSignature(factory, namespace, data.signature, identity);
      transaction.transportOrder = factory.newRelationship(namespace, 'TransportOrder', data.orderID);
    } else if (transactionName === Transaction.UpdateEcmrStatusToCancelled) {
      transaction.ecmr                     = factory.newRelationship(namespace, 'ECMR', data.ecmrID);
      transaction.cancellation             = factory.newConcept(namespace, 'Cancellation');
      transaction.cancellation.cancelledBy = factory.newRelationship(namespace, 'Entity', data.cancellation.cancelledBy);
      transaction.cancellation.date        = data.cancellation.date;
      transaction.cancellation.reason      = data.cancellation.reason;
    } else if ((transactionName === Transaction.UpdateExpectedPickupWindow) || (transactionName === Transaction.UpdateExpectedDeliveryWindow)) {
      transaction.ecmr                     = factory.newRelationship(namespace, 'ECMR', data.ecmrID);
      transaction.expectedWindow           = factory.newConcept(namespace, 'DateWindow');
      transaction.expectedWindow.startDate = data.expectedWindow.startDate;
      transaction.expectedWindow.endDate   = data.expectedWindow.endDate;
    }

    return transaction;
  }

  // TODO improve function
  public async getEcmrsByVin(transactionHandler: TransactionHandler, connection: Connection, identity: Identity, connectionProfile: string, vin: string): Promise<any> {
    let vehicle       = await transactionHandler.query(identity, connection, connectionProfile, QueryReturnType.Single, Query.GetVehicleByVin, {vin: vin});
    let result: any[] = [];
    if (!vehicle) {
      return result;
    } else {
      for (let ecmr of vehicle.ecmrs) {
        // get all the ecmrs contained in the vehicle
        const ecmrID = ecmr.split('#')[1];
        await transactionHandler.query(identity, connection, connectionProfile, QueryReturnType.Single, Query.GetEcmrById, {ecmrID: ecmrID}).then((ecmr) => {
          if (ecmr instanceof Object) {
            result.push(ecmr);
          }
        });
      }
      return {body: result};
    }
  }

  // TODO improve function
  public async getEcmrsByPlateNumber(transactionHandler: TransactionHandler, connection: Connection, identity: Identity, connectionProfile: string, plateNumber: string): Promise<any> {
    // get vehicle by vin
    const vehicle     = await transactionHandler.query(identity, connection, connectionProfile, QueryReturnType.Single, Query.GetVehicleByPlateNumber, {plateNumber: plateNumber});
    let result: any[] = [];
    if (!vehicle) {
      return result;
    } else {
      for (let ecmr of vehicle.ecmrs) {
        const ecmrID = ecmr.split('#')[1];
        // get all the ecmrs contained in the vehicle
        await transactionHandler.query(identity, connection, connectionProfile, QueryReturnType.Single, Query.GetEcmrById, {ecmrID: ecmrID}).then((ecmr) => {
          if (ecmr instanceof Object) {
            result.push(ecmr);
          }
        });
      }
      return {body: result};
    }
  }
}