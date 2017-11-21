import {BuilderUtils} from '../../../blockchain/BuilderUtils';
import {Factory} from 'composer-common';

export class CompoundBuilder {
  public static buildCreateCompoundOrg(factory: Factory, namespace: string, compoundOrg: any): any {
    let validatedObject     = BuilderUtils.createResource(factory, namespace, 'CompoundOrg', compoundOrg);
    validatedObject.address = BuilderUtils.createConcept(factory, namespace, 'Address', compoundOrg.address);

    return validatedObject;
  }
}