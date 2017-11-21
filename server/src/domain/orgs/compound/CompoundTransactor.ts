import {CompoundBuilder} from './CompoundBuilder';
import {Factory} from 'composer-common';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class CompoundTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resource: any, ...optionals: any[]): Promise<any> {
    let transaction         = factory.newTransaction(namespace, transactionName);
    transaction.compoundOrg = CompoundBuilder.buildCreateCompoundOrg(factory, namespace, resource);

    return transaction;
  }
}