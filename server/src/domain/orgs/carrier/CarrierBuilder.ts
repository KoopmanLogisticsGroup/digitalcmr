import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {CarrierOrg} from '../../../sdk/api';
import {Factory} from 'composer-common';

export class CarrierBuilder {
  public static buildCreateCarrierOrg(factory: Factory, namespace: string, carrierOrg: CarrierOrg): any {
    let transaction                = factory.newTransaction(namespace, 'CreateCarrierOrg');
    transaction.carrierOrg         = BuilderUtils.createResource(factory, namespace, 'CarrierOrg', carrierOrg);
    transaction.carrierOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', carrierOrg.address);

    return transaction;
  }
}