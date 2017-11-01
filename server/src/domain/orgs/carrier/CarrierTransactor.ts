import {CarrierBuilder} from './CarrierBuilder';
import {Factory} from 'composer-common';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class CarrierTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any> {
    return CarrierBuilder.buildCreateCarrierOrg(factory, namespace, resource);
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}