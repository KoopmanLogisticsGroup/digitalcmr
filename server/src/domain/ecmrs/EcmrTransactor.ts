import {Identity} from '../Identity';
import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {EcmrBuilder} from './EcmrBuilder';
import {TransactionHandler} from '../../blockchain/TransactionHandler';

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

  // TODO improve functionw
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