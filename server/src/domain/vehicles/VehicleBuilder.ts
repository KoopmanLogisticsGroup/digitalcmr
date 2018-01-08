import {Factory} from 'composer-common';
import {BuilderUtils} from '../../blockchain/BuilderUtils';

export class VehicleBuilder {
  public static buildVehicles(factory: Factory, namespace: string, vehicles: any[]): any {
    let validatedObjects: any[] = [];

    for (const vehicle of vehicles) {
      validatedObjects.push(this.buildVehicle(factory, namespace, vehicle));
    }

    return validatedObjects;
  }

  public static buildVehicle(factory: Factory, namespace: string, vehicle: any): any {
    let validatedObject = BuilderUtils.createResource(factory, namespace, 'Vehicle', vehicle);

    for (let j = 0; j < vehicle.ecmrs.length; j++) {
      validatedObject.ecmrs[j] = BuilderUtils.createRelationship(factory, namespace, 'ECMR', vehicle.ecmrs[j]);
    }

    return validatedObject;
  }
}