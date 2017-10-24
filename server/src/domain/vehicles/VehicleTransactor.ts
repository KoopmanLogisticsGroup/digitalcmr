import {Factory} from 'composer-common';
import {VehicleBuilder} from './VehicleBuilder';
import {TransactionCreator} from '../../blockchain/TransactionCreator';

export class VehicleTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resources: any, ...optionals: any[]): Promise<any> {
    let transaction: any;

    if (Array.isArray(resources)) {
      transaction          = factory.newTransaction(namespace, 'CreateVehicles');
      transaction.vehicles = VehicleBuilder.buildCreateVehicles(factory, namespace, resources);
    } else {
      transaction         = factory.newTransaction(namespace, 'CreateVehicle');
      transaction.vehicle = VehicleBuilder.buildCreateVehicle(factory, namespace, resources);
    }

    return transaction;
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}