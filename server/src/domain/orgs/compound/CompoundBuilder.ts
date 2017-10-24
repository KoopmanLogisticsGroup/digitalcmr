import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {CompoundOrg} from '../../../sdk/api';
import {Factory} from 'composer-common';

export class CompoundBuilder {
  public static buildCreateCompoundOrg(factory: Factory, namespace: string, compoundOrg: CompoundOrg): any {
    let transaction                 = factory.newTransaction(namespace, 'CreateCompoundOrg');
    transaction.compoundOrg         = BuilderUtils.createResource(factory, namespace, 'CompoundOrg', compoundOrg);
    transaction.compoundOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', compoundOrg.address);

    return transaction;
  }
}