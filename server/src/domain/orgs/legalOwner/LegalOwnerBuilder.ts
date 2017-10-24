import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class LegalOwnerBuilder {
  public static buildCreateLegalOwnerOrg(factory: Factory, namespace: string, legalOwnerOrg: any): any {
    let transaction                   = factory.newTransaction(namespace, 'CreateLegalOwnerOrg');
    transaction.legalOwnerOrg         = BuilderUtils.createResource(factory, namespace, 'LegalOwnerOrg', legalOwnerOrg);
    transaction.legalOwnerOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', legalOwnerOrg.address);

    return transaction;
  }
}