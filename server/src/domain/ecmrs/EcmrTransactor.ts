import {Identity} from '../Identity';
import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {EcmrBuilder} from './EcmrBuilder';
import {TransactionHandler} from '../../blockchain/TransactionHandler';
import {TransportOrderTransactor} from '../transportOrder/TransportOrderTransactor';
import {Ecmr} from '../../../resources/interfaces/ecmr.interface';

export class EcmrTransactor implements TransactionCreator {
  public async create(factory: Factory, namespace: string, data: any, enrollmentID: string, ip?: string): Promise<any> {
    let transaction: any;

    if (Array.isArray(data)) {
      transaction       = factory.newTransaction(namespace, 'CreateECMRs');
      transaction.ecmrs = await EcmrBuilder.buildECMRs(factory, namespace, data, enrollmentID, ip);
    } else {
      transaction      = factory.newTransaction(namespace, 'CreateECMR');
      transaction.ecmr = await EcmrBuilder.buildECMR(factory, namespace, data, enrollmentID, ip);
    }

    return transaction;
  }

  public update(factory: Factory, namespace: string, data: any, enrollmentID: string, ip?: any): any {
    let transaction  = factory.newTransaction(namespace, 'UpdateECMR');
    transaction.ecmr = EcmrBuilder.buildECMR(factory, namespace, data, enrollmentID, ip);

    return transaction;
  }

  public async createEcmrFromTransportOrder(identity: Identity, connectionProfile: string, namespace: string, ecmrs: any, transactionHandler: TransactionHandler): Promise<any> {
    await transactionHandler.create(identity, connectionProfile, namespace, ecmrs, new EcmrTransactor());
    let orderID           = ecmrs[0].orderID;
    let transportOrder    = await transactionHandler.executeQuery(identity, connectionProfile, 'getTransportOrderById', {orderID: orderID});

    for (const ecmr of ecmrs) {
      transportOrder.ecmrs.push(ecmr.ecmrID);
    }
    return await transactionHandler.update(identity, connectionProfile, namespace, ecmrs, transportOrder.orderID, new TransportOrderTransactor());
  }

  public async updateECMRAndTransportOrder(identity: Identity, connectionProfile: string, namespace: string, ecmr: Ecmr, transactionHandler: TransactionHandler): Promise<any> {
    if (ecmr.status === 'DELIVERED') {
      let orderID           = ecmr.orderID;
      let transportOrder    = await transactionHandler.executeQuery(identity, connectionProfile, 'getTransportOrderById', {orderID: orderID});
      await transactionHandler.update(identity, connectionProfile, namespace, transportOrder, transportOrder.orderID, new TransportOrderTransactor());
    }

    return await transactionHandler.update(identity, connectionProfile, namespace, ecmr, ecmr.ecmrID, new EcmrTransactor());
  }

  // TODO improve function
  public async getEcmrsByVin(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, vin: string): Promise<any> {
    let vehicles      = await transactionHandler.executeQuery(identity, connectionProfile, 'getVehicleByVin', {vin: vin});
    let result: any[] = [];
    if (vehicles.length === 0) {
      return result;
    } else {
      for (let ecmr of vehicles.ecmrs) {
        // get all the ecmrs contained in the vehicle
        const ecmrID = ecmr.split('#')[1];
        await transactionHandler.executeQuery(identity, connectionProfile, 'getEcmrById', {ecmrID: ecmrID}).then((assets) => {
          if (assets instanceof Object) {
            result.push(assets);
          }
        });
      }
      return {body: result};
    }
  }

  // TODO improve function
  public async getEcmrsByPlateNumber(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, plateNumber: string): Promise<any> {
    // get vehicle by vin
    const vehicles    = await transactionHandler.executeQuery(identity, connectionProfile, 'getVehicleByPlateNumber', {plateNumber: plateNumber});
    let result: any[] = [];
    if (vehicles.length === 0) {
      return result;
    } else {
      for (let ecmr of vehicles.ecmrs) {
        const ecmrID = ecmr.split('#')[1];
        // get all the ecmrs contained in the vehicle
        await transactionHandler.executeQuery(identity, connectionProfile, 'getEcmrById', {ecmrID: ecmrID}).then((assets) => {
          if (assets instanceof Object) {
            result.push(assets);
          }
        });
      }
      return {body: result};
    }
  }
}