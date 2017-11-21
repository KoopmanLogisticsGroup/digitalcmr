import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class LegalOwnerBuilder {
  public static buildCreateLegalOwnerOrg(factory: Factory, namespace: string, legalOwnerOrg: any): any {
    let validatedObject     = BuilderUtils.createResource(factory, namespace, 'LegalOwnerOrg', legalOwnerOrg);
    validatedObject.address = BuilderUtils.createConcept(factory, namespace, 'Address', legalOwnerOrg.address);

    return validatedObject;
  }
}