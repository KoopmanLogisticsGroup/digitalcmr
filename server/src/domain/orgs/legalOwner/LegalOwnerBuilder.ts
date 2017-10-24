import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {LegalOwnerOrg} from '../../../sdk/api';
import {Factory} from 'composer-common';

export class LegalOwnerBuilder {
  public static buildCreateLegalOwnerOrg(factory: Factory, namespace: string, legalOwnerOrg: LegalOwnerOrg): any {
    let transaction                   = factory.newTransaction(namespace, 'CreateLegalOwner');
    transaction.legalOwnerOrg         = BuilderUtils.createResource(factory, namespace, 'LegalOwnerOrg', legalOwnerOrg);
    transaction.legalOwnerOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', legalOwnerOrg.address);

    return transaction;
  }
}