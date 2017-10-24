import {CompoundBuilder} from './CompoundBuilder';
import {Factory} from 'composer-common';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class CompoundTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any> {
    return CompoundBuilder.buildCreateCompoundOrg(factory, namespace, resource);
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}