import {BuilderUtils} from '../../blockchain/BuilderUtils';
import {Ecmr} from '../../../src/interfaces/ecmr.interface';
import {VehicleBuilder} from '../vehicles/VehicleBuilder';
import {Identity} from '../../interfaces/entity.inferface';

export class EcmrBuilder {
  public static buildECMR(factory: any, namespace: string, ecmr: Ecmr, identity: Identity): any {
    let validatedObject              = BuilderUtils.createResource(factory, namespace, 'ECMR', ecmr);
    validatedObject.creation         = BuilderUtils.createConcept(factory, namespace, 'Creation', ecmr.creation);
    validatedObject.creation.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.creation.address);
    validatedObject.loading          = BuilderUtils.createConcept(factory, namespace, 'Loading', ecmr.loading);

    if (ecmr.loading.expectedWindow) {
      validatedObject.loading.expectedWindow = BuilderUtils.createConcept(factory, namespace, 'DateWindow', ecmr.loading.expectedWindow);
    }

    validatedObject.loading.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.loading.address);
    validatedObject.delivery        = BuilderUtils.createConcept(factory, namespace, 'Delivery', ecmr.delivery);

    if (ecmr.delivery.expectedWindow) {
      validatedObject.delivery.expectedWindow = BuilderUtils.createConcept(factory, namespace, 'DateWindow', ecmr.delivery.expectedWindow);
    }

    validatedObject.delivery.address = BuilderUtils.createConcept(factory, namespace, 'Address', ecmr.delivery.address);

    validatedObject.owner  = BuilderUtils.createRelationship(factory, namespace, 'LegalOwnerOrg', ecmr.owner);
    validatedObject.source = BuilderUtils.createRelationship(factory, namespace, 'CompoundOrg', ecmr.source);
    if (ecmr.transporter) {
      validatedObject.transporter = BuilderUtils.createRelationship(factory, namespace, 'CarrierMember', ecmr.transporter);
    }
    validatedObject.carrier   = BuilderUtils.createRelationship(factory, namespace, 'CarrierOrg', ecmr.carrier);
    validatedObject.recipient = BuilderUtils.createRelationship(factory, namespace, 'RecipientOrg', ecmr.recipient);
    if (ecmr.recipientMember) {
      validatedObject.recipientMember = BuilderUtils.createRelationship(factory, namespace, 'RecipientMember', ecmr.recipientMember);
    }
    validatedObject.issuedBy = BuilderUtils.createRelationship(factory, namespace, 'Entity', ecmr.issuedBy);

    if (ecmr.compoundSignature) {
      validatedObject.compoundSignature = EcmrBuilder.buildSignature(factory, namespace, ecmr.compoundSignature, identity);
    }

    if (ecmr.carrierLoadingSignature) {
      validatedObject.carrierLoadingSignature = EcmrBuilder.buildSignature(factory, namespace, ecmr.carrierLoadingSignature, identity);
    }

    if (ecmr.carrierDeliverySignature) {
      validatedObject.carrierDeliverySignature = EcmrBuilder.buildSignature(factory, namespace, ecmr.carrierDeliverySignature, identity);
    }

    if (ecmr.recipientSignature) {
      validatedObject.recipientSignature = EcmrBuilder.buildSignature(factory, namespace, ecmr.recipientSignature, identity);
    }

    validatedObject.goods = EcmrBuilder.buildGoods(factory, namespace, ecmr.goods);

    return validatedObject;
  }

  public static async buildECMRs(factory: any, namespace: string, ecmrs: any, identity: Identity): Promise<any> {
    let validatedObjects: any = [];

    for (const ecmr of ecmrs) {
      validatedObjects.push(this.buildECMR(factory, namespace, ecmr, identity));
    }

    return validatedObjects;
  }

  public static buildGood(factory: any, namespace: string, good: any): any {
    let validatedObject             = BuilderUtils.createConcept(factory, namespace, 'Good', good);
    validatedObject.source          = BuilderUtils.createRelationship(factory, namespace, 'CompoundOrg', good.source);
    validatedObject.recipient       = BuilderUtils.createRelationship(factory, namespace, 'RecipientOrg', good.recipient);
    validatedObject.pickupWindow    = BuilderUtils.createConcept(factory, namespace, 'DateWindow', good.pickupWindow);
    validatedObject.deliveryWindow  = BuilderUtils.createConcept(factory, namespace, 'DateWindow', good.deliveryWindow);
    validatedObject.loadingAddress  = BuilderUtils.createConcept(factory, namespace, 'Address', good.loadingAddress);
    validatedObject.deliveryAddress = BuilderUtils.createConcept(factory, namespace, 'Address', good.deliveryAddress);
    if (good.compoundRemark) {
      validatedObject.compoundRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', good.compoundRemark);
      validatedObject.compoundRemark.comments  = good.compoundRemark.comments;
      validatedObject.compoundRemark.isDamaged = good.compoundRemark.isDamaged;
    }

    if (good.carrierLoadingRemark) {
      validatedObject.carrierLoadingRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', good.carrierLoadingRemark);
      validatedObject.carrierLoadingRemark.comments  = good.carrierLoadingRemark.comments;
      validatedObject.carrierLoadingRemark.isDamaged = good.carrierLoadingRemark.isDamaged;
    }

    if (good.carrierDeliveryRemark) {
      validatedObject.carrierDeliveryRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', good.carrierDeliveryRemark);
      validatedObject.carrierDeliveryRemark.comments  = good.carrierDeliveryRemark.comments;
      validatedObject.carrierDeliveryRemark.isDamaged = good.carrierDeliveryRemark.isDamaged;
    }

    if (good.recipientRemark) {
      validatedObject.recipientRemark           = BuilderUtils.createConcept(factory, namespace, 'Remark', good.recipientRemark);
      validatedObject.recipientRemark.comments  = good.recipientRemark.comments;
      validatedObject.recipientRemark.isDamaged = good.recipientRemark.isDamaged;
    }
    validatedObject.vehicle = VehicleBuilder.buildVehicle(factory, namespace, good.vehicle);

    return validatedObject;
  }

  public static buildGoods(factory: any, namespace: string, goods: any): any {
    let validatedObjects: any = [];

    for (const good of goods) {
      validatedObjects.push(EcmrBuilder.buildGood(factory, namespace, good));
    }

    return validatedObjects;
  }

  public static buildSignature(factory: any, namespace: string, signature: any, identity: Identity): any {
    let validatedObject         = BuilderUtils.createConcept(factory, namespace, 'Signature', signature);
    validatedObject.certificate = BuilderUtils.createRelationship(factory, namespace, 'User', signature.certificate || identity.userID);

    if (signature.generalRemark) {
      validatedObject.generalRemark = BuilderUtils.createConcept(factory, namespace, 'Remark', signature.generalRemark);
    }

    return validatedObject;
  }
}