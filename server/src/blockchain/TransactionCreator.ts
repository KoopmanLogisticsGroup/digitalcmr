import {Factory} from 'composer-common';

export interface TransactionCreator {
  invoke(factory: Factory, namespace: string, transactionName: string, resource: any, ...optionals: any[]): Promise<any>;
}