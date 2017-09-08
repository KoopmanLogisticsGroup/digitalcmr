import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import * as uuid from 'uuid/v4';
import {Config} from '../config';
import {CarrierOrg, CompoundOrg, ECMR, ECMRApi, LegalOwnerOrg, RecipientOrg, Vehicle} from '../sdk/api';
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

    let result  = {body: {}};
    result.body = await businessNetworkHandler.disconnect();
    return result;
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

    let result = [];

    for (let asset of assets) {
      result.push(businessNetworkHandler.getSerializer().toJSON(asset));
    }

    await businessNetworkHandler.disconnect();

    return result;

  }

  public async getEcmrsByVin(username: string, secret: string, vin: string): Promise<any> {
    const businessNetworkHandler = new BusinessNetworkHandler(username, secret);
    const businessNetwork        = await businessNetworkHandler.connect();

    // get vehicle by vin
    return businessNetwork.query('getVehicleByVin', {vin: vin}).then((vehicles) => {
      let result = {body: []};
      if (vehicles.length === 0) {
        businessNetworkHandler.disconnect().then(() => {
          return result;
        });
      } else {
        let promises = [];
        for (let ecmr of vehicles[0].ecmrs) {
          // get the ecmr identifier
          let ecmrId = ecmr;
          // get all the ecmrs contained in the vehicle
          promises.push(this.executeQuery('getEcmrById', username, secret, {id: ecmr.$identifier}).then((assets) => {
            if (assets.length > 0) {
              result = assets;
            }
          }));
        }
        return Promise.all(promises).then((values) => {
          return result;
        });
      }
    });
  }

  public async getEcmrsByPlateNumber(username: string, secret: string, plateNumber: string): Promise<any> {
    const businessNetworkHandler = new BusinessNetworkHandler(username, secret);
    const businessNetwork        = await businessNetworkHandler.connect();

    // get vehicle by vin
    return businessNetwork.query('getVehicleByPlateNumber', {plateNumber: plateNumber}).then((vehicles) => {
      let result = {body: []};
      if (vehicles.length === 0) {
        businessNetworkHandler.disconnect().then(() => {
          return result;
        });
      } else {
        let promises = [];
        for (let ecmr of vehicles[0].ecmrs) {
          // get the ecmr identifier
          let ecmrId = ecmr;
          // get all the ecmrs contained in the vehicle
          promises.push(this.executeQuery('getEcmrById', username, secret, {id: ecmr.$identifier}).then((assets) => {
            if (assets.length > 0) {
              result = assets;
            }
          }));
        }
        return Promise.all(promises).then((values) => {
          return result;
        });
      }
    });
  }

  public createECMR(factory: any, ecmr: ECMR, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateECMR');
    return this.buildECMR(factory, ecmr, transaction, enrollmentID);
  }

  public updateECMR(factory: any, ecmr: any, enrollmentID: string, ip?: any): any {
    const transaction = factory.newTransaction(this.namespace, 'UpdateECMR');
    return this.buildECMR(factory, ecmr, transaction, enrollmentID, ip);
  }

  public createLegalOwnerOrg(factory: any, legalOwnerOrg: LegalOwnerOrg, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateLegalOwnerOrg');
    return this.buildLegalOwnerOrg(factory, legalOwnerOrg, transaction, enrollmentID);
  }

  public createCompoundOrg(factory: any, compoundOrg: CompoundOrg, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateCompoundOrg');
    return this.buildCompoundOrg(factory, compoundOrg, transaction, enrollmentID);
  }

  public createCarrierOrg(factory: any, carrierOrg: CarrierOrg, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateCarrierOrg');
    return this.buildCarrierOrg(factory, carrierOrg, transaction, enrollmentID);
  }

  public createRecipientOrg(factory: any, recipientOrg: RecipientOrg, enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateRecipientOrg');
    return this.buildRecipientOrg(factory, recipientOrg, transaction, enrollmentID);
  }

  public createVehicles(factory: any, vehicles: Vehicle[], enrollmentID: string): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateVehicles');
    return this.buildVehicles(factory, vehicles, transaction, enrollmentID);
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

  private buildLegalOwnerOrg(factory: any, legalOwnerOrg: LegalOwnerOrg, transaction: any, enrollmentID: string): any {
    transaction.legalOwnerOrg = factory.newResource(this.namespace, 'LegalOwnerOrg', uuid());

    transaction.legalOwnerOrg = this.fillAttributes(transaction.legalOwnerOrg, legalOwnerOrg);

    transaction.legalOwnerOrg.address = this.createConcept('Address', legalOwnerOrg.address, factory);

    return transaction;
  }

  private buildCompoundOrg(factory: any, compoundOrg: CompoundOrg, transaction: any, enrollmentID: string): any {
    transaction.compoundOrg = factory.newResource(this.namespace, 'CompoundOrg', uuid());

    transaction.compoundOrg = this.fillAttributes(transaction.compoundOrg, compoundOrg);

    transaction.compoundOrg.address = this.createConcept('Address', compoundOrg.address, factory);

    return transaction;
  }

  private buildCarrierOrg(factory: any, carrierOrg: CarrierOrg, transaction: any, enrollmentID: string): any {
    transaction.carrierOrg = factory.newResource(this.namespace, 'CarrierOrg', uuid());

    transaction.carrierOrg = this.fillAttributes(transaction.carrierOrg, carrierOrg);

    transaction.carrierOrg.address = this.createConcept('Address', carrierOrg.address, factory);

    return transaction;
  }

  private buildRecipientOrg(factory: any, recipientOrg: RecipientOrg, transaction: any, enrollmentID: string): any {
    transaction.recipientOrg = factory.newResource(this.namespace, 'RecipientOrg', uuid());

    transaction.recipientOrg = this.fillAttributes(transaction.recipientOrg, recipientOrg);

    transaction.recipientOrg.address = this.createConcept('Address', recipientOrg.address, factory);

    return transaction;
  }

  private buildVehicles(factory: any, vehicles: Vehicle[], transaction: any, enrollmentID: string): any {
    transaction.vehicles = [];

    for (let i = 0; i < vehicles.length; i++) {
      transaction.vehicles.push(factory.newResource(this.namespace, 'Vehicle', uuid()));
      transaction.vehicles[i] = this.fillAttributes(transaction.vehicles[i], vehicles[i]);
      for (let j = 0; j < vehicles[i].ecmrs.length; j++) {
        transaction.vehicles[i].ecmrs[j] = factory.newRelationship(this.namespace, 'ECMR', vehicles[i].ecmrs[j]);
      }
    }
    return transaction;
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

}
