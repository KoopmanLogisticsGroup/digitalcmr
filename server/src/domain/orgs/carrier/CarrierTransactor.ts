import {CarrierBuilder} from './CarrierBuilder';
import {Factory} from 'composer-common';
import {TransactionCreator} from '../../../blockchain/TransactionCreator';

export class CarrierTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resource: any, ...optionals: any[]): Promise<any> {
    let transaction        = factory.newTransaction(namespace, transactionName);
    transaction.carrierOrg = CarrierBuilder.buildCreateCarrierOrg(factory, namespace, resource);

    return transaction;
  }
}