import {Factory} from 'composer-common';
import {LegalOwnerBuilder} from './LegalOwnerBuilder';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class LegalOwnerTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any> {
    return LegalOwnerBuilder.buildCreateLegalOwnerOrg(factory, namespace, resource);
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}