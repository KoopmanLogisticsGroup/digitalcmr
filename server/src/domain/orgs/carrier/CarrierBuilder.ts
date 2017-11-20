import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class CarrierBuilder {
  public static buildCreateCarrierOrg(factory: Factory, namespace: string, carrierOrg: any): any {
    let validatedObject     = BuilderUtils.createResource(factory, namespace, 'CarrierOrg', carrierOrg);
    validatedObject.address = BuilderUtils.createConcept(factory, namespace, 'Address', carrierOrg.address);

    return validatedObject;
  }
}