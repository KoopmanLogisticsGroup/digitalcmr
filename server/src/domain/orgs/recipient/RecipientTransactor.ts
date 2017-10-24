import {Factory} from 'composer-common';
import {RecipientBuilder} from './RecipientBuilder';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class RecipientTransactor implements TransactionCreator {
  public create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any> {
    return RecipientBuilder.buildCreateRecipientOrg(factory, namespace, resource);
  }

  public update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
}