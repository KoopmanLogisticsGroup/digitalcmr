import {Factory} from 'composer-common';

export interface TransactionCreator {
  create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any>;

  update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any>;
}