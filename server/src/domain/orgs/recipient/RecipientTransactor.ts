import {Factory} from 'composer-common';
import {RecipientBuilder} from './RecipientBuilder';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class RecipientTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resource: any, ...optionals: any[]): Promise<any> {
    let transaction          = factory.newTransaction(namespace, transactionName);
    transaction.recipientOrg = RecipientBuilder.buildCreateRecipientOrg(factory, namespace, resource);

    return transaction;
  }
}