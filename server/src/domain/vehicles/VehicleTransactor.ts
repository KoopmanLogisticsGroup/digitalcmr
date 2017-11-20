import {Factory} from 'composer-common';
import {VehicleBuilder} from './VehicleBuilder';
import {TransactionCreator} from '../../blockchain/TransactionCreator';

export class VehicleTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resources: any, ...optionals: any[]): Promise<any> {
    let transaction      = factory.newTransaction(namespace, transactionName);
    transaction.vehicles = VehicleBuilder.buildCreateVehicles(factory, namespace, resources);

    return transaction;
  }
}