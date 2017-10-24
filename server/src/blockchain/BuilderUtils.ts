import * as uuid from 'uuid/v4';
import {Factory} from 'composer-common';

export class BuilderUtils {
  public static createResource(factory: Factory, namespace: string, className: string, resourceData: any, resourceID?: string): any {
    const resource = factory.newResource(namespace, className, resourceID || uuid());

    return this.fillAttributes(resource, resourceData);
  }

  public static createConcept(factory: Factory, namespace: string, className: string, conceptData: any): any {
    const concept = factory.newConcept(namespace, className);

    return this.fillAttributes(concept, conceptData);
  }

  public static createRelationship(factory: Factory, namespace: string, className: string, identifier: string): any {
    return factory.newRelationship(namespace, className, identifier);
  }

  public static fillAttributes(outObject: any, inObject: any): any {
    for (const key of Object.keys(inObject)) {
      outObject[key] = inObject[key];
    }

    return outObject;
  }
}