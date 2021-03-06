import {Factory} from 'composer-common';
import {VehicleBuilder} from './VehicleBuilder';
import {TransactionCreator} from '../../blockchain/TransactionCreator';
import {Transaction} from '../../blockchain/Transactions';

export class VehicleTransactor implements TransactionCreator {
  public invoke(factory: Factory, namespace: string, transactionName: string, resources: any, ...optionals: any[]): Promise<any> {
    let transaction = factory.newTransaction(namespace, transactionName);

    if (transactionName === Transaction.CreateVehicles) {
      transaction.vehicles = VehicleBuilder.buildVehicles(factory, namespace, resources);
    }

    return transaction;
  }
}