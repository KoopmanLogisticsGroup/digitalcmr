import {BuilderUtils} from '../../blockchain/BuilderUtils';

export class EcmrBuilder {
  public static buildECMR(factory: any, namespace: string, ecmr: any, enrollmentID: string, ip?: any): any {
    let validatedObject = BuilderUtils.createResource(factory, namespace, 'ECMR', ecmr);

    validatedObject.creation         = BuilderUtils.createConcept(factory, namespace, 'Creation', ecmr.creation);
    validatedObject.creation.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.creation.address);
    validatedObject.loading          = BuilderUtils.createConcept(factory, namespace, 'Loading', ecmr.loading);
    validatedObject.loading.address  = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.loading.address);
    validatedObject.delivery         = BuilderUtils.createConcept(factory, namespace, 'Delivery', ecmr.delivery);
    validatedObject.delivery.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.delivery.address);

    validatedObject.owner        = BuilderUtils.createRelationship(factory, namespace, 'LegalOwnerOrg', ecmr.owner);
    validatedObject.source       = BuilderUtils.createRelationship(factory, namespace, 'CompoundOrg', ecmr.source);
    validatedObject.transporter  = BuilderUtils.createRelationship(factory, namespace, 'CarrierMember', ecmr.transporter);
    validatedObject.carrier      = BuilderUtils.createRelationship(factory, namespace, 'CarrierOrg', ecmr.carrier);
    validatedObject.recipientOrg = BuilderUtils.createRelationship(factory, namespace, 'RecipientOrg', ecmr.recipientOrg);
    validatedObject.recipient    = BuilderUtils.createRelationship(factory, namespace, 'RecipientMember', ecmr.recipient);
    validatedObject.issuedBy     = BuilderUtils.createRelationship(factory, namespace, 'Entity', ecmr.issuedBy);

    if (ecmr.compoundSignature) {
      validatedObject.compoundSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.compoundSignature);
      validatedObject.compoundSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.compoundSignature.generalRemark) {
        validatedObject.compoundSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.compoundSignature.generalRemark);
      }

      if (ecmr.status === 'CREATED') {
        validatedObject.status = 'LOADED';
        if (ip) {
          validatedObject.compoundSignature.ip = ip;
        }
      }

      validatedObject.compoundSignature.timestamp = new Date().getTime();
    }
    if (ecmr.carrierLoadingSignature) {
      validatedObject.carrierLoadingSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.carrierLoadingSignature);
      validatedObject.carrierLoadingSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.carrierLoadingSignature.generalRemark) {
        validatedObject.carrierLoadingSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.carrierLoadingSignature.generalRemark);
      }

      if (ecmr.status === 'LOADED') {
        validatedObject.status = 'IN_TRANSIT';
        if (ip) {
          validatedObject.carrierLoadingSignature.ip = ip;
        }
      }

      validatedObject.carrierLoadingSignature.timestamp = new Date().getTime();
    }
    if (ecmr.carrierDeliverySignature) {
      validatedObject.carrierDeliverySignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.carrierDeliverySignature);
      validatedObject.carrierDeliverySignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.carrierDeliverySignature.generalRemark) {
        validatedObject.carrierDeliverySignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.carrierDeliverySignature.generalRemark);
      }

      if (ecmr.status === 'IN_TRANSIT') {
        if (ip) {
          validatedObject.carrierDeliverySignature.ip = ip;
        }
        validatedObject.status = 'DELIVERED';
      }

      validatedObject.carrierDeliverySignature.timestamp = new Date().getTime();
    }
    if (ecmr.recipientSignature) {
      validatedObject.recipientSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.recipientSignature);
      validatedObject.recipientSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.recipientSignature.generalRemark) {
        validatedObject.recipientSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.recipientSignature.generalRemark);
      }

      if (ecmr.status === 'DELIVERED') {
        validatedObject.status = 'CONFIRMED_DELIVERED';
        if (ip) {
          validatedObject.recipientSignature.ip = ip;
        }
      }

      validatedObject.recipientSignature.timestamp = new Date().getTime();
    }

    for (let i = 0; i < ecmr.goods.length; i++) {
      validatedObject.goods[i] = BuilderUtils.createConcept(factory, namespace, 'Good', ecmr.goods[i]);
      if (ecmr.goods[i].compoundRemark) {
        validatedObject.goods[i].compoundRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].compoundRemark);
        validatedObject.goods[i].compoundRemark.comments  = ecmr.goods[i].compoundRemark.comments;
        validatedObject.goods[i].compoundRemark.isDamaged = ecmr.goods[i].compoundRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierLoadingRemark) {
        validatedObject.goods[i].carrierLoadingRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].carrierLoadingRemark);
        validatedObject.goods[i].carrierLoadingRemark.comments  = ecmr.goods[i].carrierLoadingRemark.comments;
        validatedObject.goods[i].carrierLoadingRemark.isDamaged = ecmr.goods[i].carrierLoadingRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierDeliveryRemark) {
        validatedObject.goods[i].carrierDeliveryRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].carrierDeliveryRemark);
        validatedObject.goods[i].carrierDeliveryRemark.comments  = ecmr.goods[i].carrierDeliveryRemark.comments;
        validatedObject.goods[i].carrierDeliveryRemark.isDamaged = ecmr.goods[i].carrierDeliveryRemark.isDamaged;
      }

      if (ecmr.goods[i].recipientRemark) {
        validatedObject.goods[i].recipientRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].recipientRemark);
        validatedObject.goods[i].recipientRemark.comments  = ecmr.goods[i].recipientRemark.comments;
        validatedObject.goods[i].recipientRemark.isDamaged = ecmr.goods[i].recipientRemark.isDamaged;
      }

      let vehicle                      = BuilderUtils.createResource(factory, namespace, 'Vehicle', ecmr.goods[i].vehicle);
      validatedObject.goods[i].vehicle = vehicle;
    }

    return validatedObject;
  }

  public static async buildECMRs(factory: any, namespace: string, ecmrs: any, enrollmentID: string, ip?: any): Promise<any> {
    let validatedObjects: any = [];

    for (const ecmr of ecmrs) {
      validatedObjects.push(await this.buildECMR(factory, namespace, ecmr, enrollmentID, ip));
    }

    return validatedObjects;
  }
}