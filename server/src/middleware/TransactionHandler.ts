import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import * as uuid from 'uuid/v4';
import {Config} from '../config';
import {ECMR, ECMRApi} from '../sdk/api';
import http = require('http');

export class TransactionHandler {
  private channel: string;
  private namespace: string;

  public constructor() {
    this.channel   = Config.settings.composer.channel;
    this.namespace = Config.settings.composer.namespace;
  }

  public async testConnection(username: string, secret: string): Promise<any> {
    const businessNetworkHandler = new BusinessNetworkHandler(username, secret);
    await businessNetworkHandler.connect();
    await businessNetworkHandler.ping();

    return businessNetworkHandler.disconnect();
  }

  public async put(data: any, username: string, secret: string, transactionCreator: Function): Promise<any> {
    const businessNetworkHandler    = new BusinessNetworkHandler(username, secret);
    const businessNetworkConnection = await businessNetworkHandler.connect();
    const factory                   = businessNetworkHandler.getFactory();

    const transaction = transactionCreator(factory, data);

    await businessNetworkConnection.submitTransaction(transaction);
    await businessNetworkHandler.disconnect();
  }

  public async get(resourceID: string, assetRegistry: string, username: string, secret: string): Promise<any> {
    const businessNetworkHandler    = new BusinessNetworkHandler(username, secret);
    const businessNetworkConnection = await businessNetworkHandler.connect();
    const resourceAssetRegistry     = await businessNetworkConnection.getAssetRegistry(this.namespace + '.' + assetRegistry);

    const rawResource = await resourceAssetRegistry.get(resourceID);
    await businessNetworkHandler.disconnect();

    return businessNetworkHandler.getSerializer().toJSON(rawResource);
  }

  public async getAllECMRs(username: string, secret: string, query: Function): Promise<any> {
    const businessNetworkHandler = new BusinessNetworkHandler(username, secret);
    await businessNetworkHandler.connect();

    const ecmrs = await query();
    await businessNetworkHandler.disconnect();

    return ecmrs;
  }

  public async executeQuery(queryName: string, username: string, secret: string, parameters?: any): Promise<any> {
    const businessNetworkHandler = new BusinessNetworkHandler(username, secret);
    const businessNetwork        = await businessNetworkHandler.connect();

    if (!parameters) {
      parameters = {};
    }

    const assets = await businessNetwork.query(queryName, parameters);

    let result = {body: []};

    for (let asset of assets) {
      result.body.push(businessNetworkHandler.getSerializer().toJSON(asset));
    }

    await businessNetworkHandler.disconnect();

    return result;

  }

  private buildECMR(factory: any, ecmr: any, transaction: any, enrollmentID: string, ip?: any): any {
    transaction.ecmr = factory.newResource(this.namespace, 'ECMR', uuid());

    transaction.ecmr = this.fillAttributes(transaction.ecmr, ecmr);

    transaction.ecmr.creation         = this.createConcept('Creation', ecmr.creation, factory);
    transaction.ecmr.creation.address = this.createConcept('Address', ecmr.creation.address, factory);
    transaction.ecmr.loading          = this.createConcept('Loading', ecmr.loading, factory);
    transaction.ecmr.loading.address  = this.createConcept('Address', ecmr.loading.address, factory);
    transaction.ecmr.delivery         = this.createConcept('Delivery', ecmr.delivery, factory);
    transaction.ecmr.delivery.address = this.createConcept('Address', ecmr.delivery.address, factory);

    transaction.ecmr.owner        = factory.newRelationship(this.namespace, 'LegalOwnerOrg', ecmr.owner);
    transaction.ecmr.source       = factory.newRelationship(this.namespace, 'CompoundOrg', ecmr.source);
    transaction.ecmr.transporter  = factory.newRelationship(this.namespace, 'CarrierMember', ecmr.transporter);
    transaction.ecmr.carrier      = factory.newRelationship(this.namespace, 'CarrierOrg', ecmr.carrier);
    transaction.ecmr.recipientOrg = factory.newRelationship(this.namespace, 'RecipientOrg', ecmr.recipientOrg);
    transaction.ecmr.recipient    = factory.newRelationship(this.namespace, 'RecipientMember', ecmr.recipient);
    transaction.ecmr.issuedBy     = factory.newRelationship(this.namespace, 'Entity', ecmr.issuedBy);

    if (ecmr.compoundSignature) {
      transaction.ecmr.compoundSignature             = this.createConcept('Signature', ecmr.compoundSignature, factory);
      transaction.ecmr.compoundSignature.certificate = factory.newRelationship(this.namespace, 'User', enrollmentID);
      if (ecmr.compoundSignature.generalRemark) {
        transaction.ecmr.compoundSignature.generalRemark = this.createConcept('Remark', ecmr.compoundSignature.generalRemark, factory);
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
      transaction.ecmr.carrierLoadingSignature             = this.createConcept('Signature', ecmr.carrierLoadingSignature, factory);
      transaction.ecmr.carrierLoadingSignature.certificate = factory.newRelationship(this.namespace, 'User', enrollmentID);
      if (ecmr.carrierLoadingSignature.generalRemark) {
        transaction.ecmr.carrierLoadingSignature.generalRemark = this.createConcept('Remark', ecmr.carrierLoadingSignature.generalRemark, factory);
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
      transaction.ecmr.carrierDeliverySignature             = this.createConcept('Signature', ecmr.carrierDeliverySignature, factory);
      transaction.ecmr.carrierDeliverySignature.certificate = factory.newRelationship(this.namespace, 'User', enrollmentID);
      if (ecmr.carrierDeliverySignature.generalRemark) {
        transaction.ecmr.carrierDeliverySignature.generalRemark = this.createConcept('Remark', ecmr.carrierDeliverySignature.generalRemark, factory);
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
      transaction.ecmr.recipientSignature             = this.createConcept('Signature', ecmr.recipientSignature, factory);
      transaction.ecmr.recipientSignature.certificate = factory.newRelationship(this.namespace, 'User', enrollmentID);
      if (ecmr.recipientSignature.generalRemark) {
        transaction.ecmr.recipientSignature.generalRemark = this.createConcept('Remark', ecmr.recipientSignature.generalRemark, factory);
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
      transaction.ecmr.goods[i] = this.createConcept('Good', ecmr.goods[i], factory);
      if (ecmr.goods[i].compoundRemark) {
        transaction.ecmr.goods[i].compoundRemark           = this.createConcept('Remark', ecmr.goods[i].compoundRemark, factory);
        transaction.ecmr.goods[i].compoundRemark.comments  = ecmr.goods[i].compoundRemark.comments;
        transaction.ecmr.goods[i].compoundRemark.isDamaged = ecmr.goods[i].compoundRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierLoadingRemark) {
        transaction.ecmr.goods[i].carrierLoadingRemark           = this.createConcept('Remark', ecmr.goods[i].carrierLoadingRemark, factory);
        transaction.ecmr.goods[i].carrierLoadingRemark.comments  = ecmr.goods[i].carrierLoadingRemark.comments;
        transaction.ecmr.goods[i].carrierLoadingRemark.isDamaged = ecmr.goods[i].carrierLoadingRemark.isDamaged;
      }

      if (ecmr.goods[i].carrierDeliveryRemark) {
        transaction.ecmr.goods[i].carrierDeliveryRemark           = this.createConcept('Remark', ecmr.goods[i].carrierDeliveryRemark, factory);
        transaction.ecmr.goods[i].carrierDeliveryRemark.comments  = ecmr.goods[i].carrierDeliveryRemark.comments;
        transaction.ecmr.goods[i].carrierDeliveryRemark.isDamaged = ecmr.goods[i].carrierDeliveryRemark.isDamaged;
      }

      if (ecmr.goods[i].recipientRemark) {
        transaction.ecmr.goods[i].recipientRemark           = this.createConcept('Remark', ecmr.goods[i].recipientRemark, factory);
        transaction.ecmr.goods[i].recipientRemark.comments  = ecmr.goods[i].recipientRemark.comments;
        transaction.ecmr.goods[i].recipientRemark.isDamaged = ecmr.goods[i].recipientRemark.isDamaged;
      }

      let vehicle                       = factory.newResource(this.namespace, 'Vehicle', uuid());
      vehicle                           = this.fillAttributes(vehicle, ecmr.goods[i].vehicle);
      transaction.ecmr.goods[i].vehicle = vehicle;
    }
    return transaction;
  }

  public createECMR(factory: any, ecmr: ECMR, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateECMR');
    return this.buildECMR(factory, ecmr, transaction, enrollmentID);
  }

  public updateECMR(factory: any, ecmr: any, enrollmentID: string, ip?: any): any {
    const transaction = factory.newTransaction(this.namespace, 'UpdateECMR');
    return this.buildECMR(factory, ecmr, transaction, enrollmentID, ip);
  }

  private createConcept(conceptName: string, conceptData: any, factory: any): any {
    let concept = factory.newConcept(this.namespace, conceptName);
    return this.fillAttributes(concept, conceptData);
  }

  private convertAssetsToConcepts(assetName: string, assets: any[], factory: any): any[] {
    let assetsConcepts = [];

    for (let asset of assets) {
      let assetConcept = this.createConcept(assetName, asset, factory);
      assetConcept.id  = uuid();

      assetsConcepts.push(assetConcept);
    }

    return assetsConcepts;
  }

  private fillAttributes(outObject: any, inObject: any): any {
    for (let key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        outObject[key] = inObject[key];
      }
    }
    return outObject;
  }

}
