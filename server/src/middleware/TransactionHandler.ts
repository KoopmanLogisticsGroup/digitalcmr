import {BusinessNetworkHandler} from './BusinessNetworkHandler';
import * as uuid from 'uuid/v4';
import {Config} from '../config';
import {ECMR, ECMRApi} from '../sdk/api';

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

  public async get (resourceID: string, assetRegistry: string, username: string, secret: string): Promise<any> {
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

  public createECMR(factory: any, ecmr: ECMR): any {
    const transaction = factory.newTransaction(this.namespace, 'CreateECMR');
    transaction.ecmr  = factory.newResource(this.namespace, 'ECMR', uuid());

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

    for (let i = 0; i < transaction.ecmr.goods.length; i++) {
      transaction.ecmr.goods[i]         = this.createConcept('Good', ecmr.goods[i], factory);
      let vehicle                       = factory.newResource(this.namespace, 'Vehicle', uuid());
      vehicle                           = this.fillAttributes(vehicle, ecmr.goods[i].vehicle);
      transaction.ecmr.goods[i].vehicle = vehicle;
    }

    return transaction;
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
