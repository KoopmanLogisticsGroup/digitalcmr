import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {RecipientOrg} from '../../../sdk/api';
import {Factory} from 'composer-common';

export class RecipientBuilder {
  public static buildCreateRecipientOrg(factory: Factory, namespace: string, recipientOrg: RecipientOrg): any {
    let transaction                  = factory.newTransaction(namespace, 'CreateRecipientOrg');
    transaction.recipientOrg         = factory.newResource(factory, namespace, 'RecipientOrg', recipientOrg);
    transaction.recipientOrg.address = BuilderUtils.createConcept(factory, namespace, 'Address', recipientOrg.address);

    return transaction;
  }
}