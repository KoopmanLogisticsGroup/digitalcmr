import {Factory} from 'composer-common';
import {VehicleBuilder} from './VehicleBuilder';
import {TransactionCreator} from '../../blockchain/TransactionCreator';

export class VehicleTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resources: any, ...optionals: any[]): Promise<any> {
    return VehicleBuilder.buildCreateVehicles(factory, namespace, resources);
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}