import {Identity} from '../Identity';
import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {EcmrBuilder} from './EcmrBuilder';
import {QueryReturnType, TransactionHandler} from '../../blockchain/TransactionHandler';

export class EcmrTransactor implements TransactionCreator {
  public async invoke(factory: Factory, namespace: string, transactionName: string, data: any, enrollmentID: string, ip?: string): Promise<any> {
    let transaction   = factory.newTransaction(namespace, transactionName);
    transaction.ecmrs = await EcmrBuilder.buildECMRs(factory, namespace, data, enrollmentID, ip);

    return transaction;
  }

  // TODO improve function
  public async getEcmrsByVin(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, vin: string): Promise<any> {
    let vehicle       = await transactionHandler.executeQuery(identity, connectionProfile, QueryReturnType.Single, 'getVehicleByVin', {vin: vin});
    let result: any[] = [];
    if (!vehicle) {
      return result;
    } else {
      for (let ecmr of vehicle.ecmrs) {
        // get all the ecmrs contained in the vehicle
        const ecmrID = ecmr.split('#')[1];
        await transactionHandler.executeQuery(identity, connectionProfile, QueryReturnType.Single, 'getEcmrById', {ecmrID: ecmrID}).then((ecmr) => {
          if (ecmr instanceof Object) {
            result.push(ecmr);
          }
        });
      }
      return {body: result};
    }
  }

  // TODO improve function
  public async getEcmrsByPlateNumber(transactionHandler: TransactionHandler, identity: Identity, connectionProfile: string, plateNumber: string): Promise<any> {
    // get vehicle by vin
    const vehicle     = await transactionHandler.executeQuery(identity, connectionProfile, QueryReturnType.Single, 'getVehicleByPlateNumber', {plateNumber: plateNumber});
    let result: any[] = [];
    if (!vehicle) {
      return result;
    } else {
      for (let ecmr of vehicle.ecmrs) {
        const ecmrID = ecmr.split('#')[1];
        // get all the ecmrs contained in the vehicle
        await transactionHandler.executeQuery(identity, connectionProfile, QueryReturnType.Single, 'getEcmrById', {ecmrID: ecmrID}).then((ecmr) => {
          if (ecmr instanceof Object) {
            result.push(ecmr);
          }
        });
      }
      return {body: result};
    }
  }
}