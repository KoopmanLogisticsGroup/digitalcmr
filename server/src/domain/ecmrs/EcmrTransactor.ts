import {Identity} from '../Identity';
import {BusinessNetworkHandler} from '../../blockchain/BusinessNetworkHandler';
import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Factory} from 'composer-common';
import {EcmrBuilder} from './EcmrBuilder';

export class EcmrTransactor implements TransactionCreator {
  public constructor(private businessNetworkHandler: BusinessNetworkHandler) {
  }

  public create(factory: Factory, namespace: string, data: any, enrollmentID: string, ip?: string): any {
    const transaction = factory.newTransaction(namespace, 'CreateECMR');
    return EcmrBuilder.buildECMR(factory, namespace, data, transaction, enrollmentID, ip);
  }

  public update(factory: Factory, namespace: string, data: any, enrollmentID: string, ip?: any): any {
    const transaction = factory.newTransaction(namespace, 'UpdateECMR');
    return EcmrBuilder.buildECMR(factory, namespace, data, transaction, enrollmentID, ip);
  }

  public async getEcmrsByVin(identity: Identity, connectionProfile: string, vin: string): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);

    // get vehicle by vin
    const vehicles = await this.businessNetworkHandler.query('getVehicleByVin', {vin: vin});
    let result     = {body: []};
    if (vehicles.length === 0) {
      this.businessNetworkHandler.disconnect().then(() => {
        return result;
      });
    } else {
      let promises: Promise<any>[] = [];
      for (let ecmr of vehicles[0].ecmrs) {
        // get all the ecmrs contained in the vehicle
        promises.push(this.businessNetworkHandler.query('getEcmrById', {id: ecmr.$identifier}).then((assets) => {
          if (assets.length > 0) {
            result = assets;
          }
        }));
      }

      const values = await Promise.all(promises);
      await this.businessNetworkHandler.disconnect();

      return values;
    }
  }

  public async getEcmrsByPlateNumber(identity: Identity, connectionProfile: string, plateNumber: string): Promise<any> {
    await this.businessNetworkHandler.connect(identity, connectionProfile);

    // get vehicle by vin
    const vehicles = await this.businessNetworkHandler.query('getVehicleByPlateNumber', {plateNumber: plateNumber});
    let result     = {body: []};
    if (vehicles.length === 0) {
      this.businessNetworkHandler.disconnect().then(() => {
        return result;
      });
    } else {
      let promises: Promise<any>[] = [];
      for (let ecmr of vehicles[0].ecmrs) {
        // get all the ecmrs contained in the vehicle
        promises.push(this.businessNetworkHandler.query('getEcmrById', {id: ecmr.$identifier}).then((assets) => {
          if (assets.length > 0) {
            result = assets;
          }
        }));
      }

      const values = Promise.all(promises);
      await this.businessNetworkHandler.disconnect();

      return values;
    }
  }
}