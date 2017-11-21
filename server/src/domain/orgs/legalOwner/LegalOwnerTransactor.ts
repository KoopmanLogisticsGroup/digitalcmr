import {Factory} from 'composer-common';
import {LegalOwnerBuilder} from './LegalOwnerBuilder';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class LegalOwnerTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resource: any, ...optionals: any[]): Promise<any> {
    let transaction           = factory.newTransaction(namespace, transactionName);
    transaction.legalOwnerOrg = LegalOwnerBuilder.buildCreateLegalOwnerOrg(factory, namespace, resource);

    return transaction;
  }
}