import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class RecipientBuilder {
  public static buildCreateRecipientOrg(factory: Factory, namespace: string, recipientOrg: any): any {
    let transaction                  = factory.newTransaction(namespace, 'CreateRecipientOrg');
    transaction.recipientOrg         = BuilderUtils.createResource(factory, namespace, 'RecipientOrg', recipientOrg);
    transaction.recipientOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', recipientOrg.address);

    return transaction;
  }
}