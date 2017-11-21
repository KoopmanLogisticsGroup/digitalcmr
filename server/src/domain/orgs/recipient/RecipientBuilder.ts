import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class RecipientBuilder {
  public static buildCreateRecipientOrg(factory: Factory, namespace: string, recipientOrg: any): any {
    let validatedObject     = BuilderUtils.createResource(factory, namespace, 'RecipientOrg', recipientOrg);
    validatedObject.address = BuilderUtils.createConcept(factory, namespace, 'Address', recipientOrg.address);

    return validatedObject;
  }
}