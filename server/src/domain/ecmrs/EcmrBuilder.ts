import {BuilderUtils} from '../../blockchain/BuilderUtils';

export class EcmrBuilder {
  public static buildECMR(factory: any, namespace: string, ecmr: any, transaction: any, enrollmentID: string, ip?: any): any {
    transaction.ecmr = BuilderUtils.createResource(factory, namespace, 'ECMR', ecmr);

    transaction.ecmr.creation         = BuilderUtils.createConcept(factory, namespace, 'Creation', ecmr.creation);
    transaction.ecmr.creation.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.creation.address);
    transaction.ecmr.loading          = BuilderUtils.createConcept(factory, namespace, 'Loading', ecmr.loading);
    transaction.ecmr.loading.address  = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.loading.address);
    transaction.ecmr.delivery         = BuilderUtils.createConcept(factory, namespace, 'Delivery', ecmr.delivery);
    transaction.ecmr.delivery.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.delivery.address);

    transaction.ecmr.owner        = BuilderUtils.createRelationship(factory, namespace, 'LegalOwnerOrg', ecmr.owner);
    transaction.ecmr.source       = BuilderUtils.createRelationship(factory, namespace, 'CompoundOrg', ecmr.source);
    transaction.ecmr.transporter  = BuilderUtils.createRelationship(factory, namespace, 'CarrierMember', ecmr.transporter);
    transaction.ecmr.carrier      = BuilderUtils.createRelationship(factory, namespace, 'CarrierOrg', ecmr.carrier);
    transaction.ecmr.recipientOrg = BuilderUtils.createRelationship(factory, namespace, 'RecipientOrg', ecmr.recipientOrg);
    transaction.ecmr.recipient    = BuilderUtils.createRelationship(factory, namespace, 'RecipientMember', ecmr.recipient);
    transaction.ecmr.issuedBy     = BuilderUtils.createRelationship(factory, namespace, 'Entity', ecmr.issuedBy);

    if (ecmr.compoundSignature) {
      transaction.ecmr.compoundSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.compoundSignature);
      transaction.ecmr.compoundSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.compoundSignature.generalRemark) {
        transaction.ecmr.compoundSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.compoundSignature.generalRemark);
      }

      if (ecmr.status === 'CREATED') {
        transaction.ecmr.status = 'LOADED';
        if (ip) {
          transaction.ecmr.compoundSignature.ip = ip;
        }
      }

      transaction.ecmr.compoundSignature.timestamp = new Date().getTime();
    }
    if (ecmr.carrierLoadingSignature) {
      transaction.ecmr.carrierLoadingSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.carrierLoadingSignature);
      transaction.ecmr.carrierLoadingSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.carrierLoadingSignature.generalRemark) {
        transaction.ecmr.carrierLoadingSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.carrierLoadingSignature.generalRemark);
      }

      if (ecmr.status === 'LOADED') {
        transaction.ecmr.status = 'IN_TRANSIT';
        if (ip) {
          transaction.ecmr.carrierLoadingSignature.ip = ip;
        }
      }

      transaction.ecmr.carrierLoadingSignature.timestamp = new Date().getTime();
    }
    if (ecmr.carrierDeliverySignature) {
      transaction.ecmr.carrierDeliverySignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.carrierDeliverySignature);
      transaction.ecmr.carrierDeliverySignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.carrierDeliverySignature.generalRemark) {
        transaction.ecmr.carrierDeliverySignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.carrierDeliverySignature.generalRemark);
      }

      if (ecmr.status === 'IN_TRANSIT') {
        if (ip) {
          transaction.ecmr.carrierDeliverySignature.ip = ip;
        }
        transaction.ecmr.status = 'DELIVERED';
      }

      transaction.ecmr.carrierDeliverySignature.timestamp = new Date().getTime();
    }
    if (ecmr.recipientSignature) {
      transaction.ecmr.recipientSignature             = BuilderUtils.createConcept(factory, namespace, 'Signature', ecmr.recipientSignature);
      transaction.ecmr.recipientSignature.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', enrollmentID);
      if (ecmr.recipientSignature.generalRemark) {
        transaction.ecmr.recipientSignature.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.recipientSignature.generalRemark);
      }

      if (ecmr.status === 'DELIVERED') {
        transaction.ecmr.status = 'CONFIRMED_DELIVERED';
        if (ip) {
          transaction.ecmr.recipientSignature.ip = ip;
        }
      }

      transaction.ecmr.recipientSignature.timestamp = new Date().getTime();
    }

    for (let i = 0; i < ecmr.goods.length; i++) {
      transaction.ecmr.goods[i] = BuilderUtils.createConcept(factory, namespace, 'Good', ecmr.goods[i]);
      if (ecmr.goods[i].compoundRemark) {
        transaction.ecmr.goods[i].compoundRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].compoundRemark);
        transaction.ecmr.goods[i].compoundRemark.comments  = ecmr.goods[i].compoundRemark.comments;
        transaction.ecmr.goods[i].compoundRemark.isDamaged = ecmr.goods[i].compoundRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierLoadingRemark) {
        transaction.ecmr.goods[i].carrierLoadingRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].carrierLoadingRemark);
        transaction.ecmr.goods[i].carrierLoadingRemark.comments  = ecmr.goods[i].carrierLoadingRemark.comments;
        transaction.ecmr.goods[i].carrierLoadingRemark.isDamaged = ecmr.goods[i].carrierLoadingRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierDeliveryRemark) {
        transaction.ecmr.goods[i].carrierDeliveryRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].carrierDeliveryRemark);
        transaction.ecmr.goods[i].carrierDeliveryRemark.comments  = ecmr.goods[i].carrierDeliveryRemark.comments;
        transaction.ecmr.goods[i].carrierDeliveryRemark.isDamaged = ecmr.goods[i].carrierDeliveryRemark.isDamaged;
      }

      if (ecmr.goods[i].recipientRemark) {
        transaction.ecmr.goods[i].recipientRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', ecmr.goods[i].recipientRemark);
        transaction.ecmr.goods[i].recipientRemark.comments  = ecmr.goods[i].recipientRemark.comments;
        transaction.ecmr.goods[i].recipientRemark.isDamaged = ecmr.goods[i].recipientRemark.isDamaged;
      }

      let vehicle                       = BuilderUtils.createResource(factory, namespace, 'Vehicle', ecmr.goods[i].vehicle);
      transaction.ecmr.goods[i].vehicle = vehicle;
    }
    return transaction;
  }
}