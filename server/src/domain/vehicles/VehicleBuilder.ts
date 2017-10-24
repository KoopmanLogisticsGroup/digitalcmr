import {Vehicle} from '../../sdk/api';
import {Factory} from 'composer-common';
import {BuilderUtils} from '../../blockchain/BuilderUtils';

export class VehicleBuilder {
  public static buildCreateVehicles(factory: Factory, namespace: string, vehicles: Vehicle[]): any {
    let transaction      = factory.newTransaction(namespace, 'CreateVehicles');
    transaction.vehicles = [];

    for (let i = 0; i < vehicles.length; i++) {
      transaction.vehicles.push(BuilderUtils.createResource(factory, namespace, 'Vehicle', vehicles[i]));
      for (let j = 0; j < vehicles[i].ecmrs.length; j++) {
        transaction.vehicles[i].ecmrs[j] = BuilderUtils.createRelationship(factory, namespace, 'ECMR', vehicles[i].ecmrs[j]);
      }
    }

    return transaction;
  }
}