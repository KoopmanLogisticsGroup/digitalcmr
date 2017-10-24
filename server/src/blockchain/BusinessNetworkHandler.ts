import {Config} from '../config';
import {BusinessNetworkConnection, ParticipantRegisty} from 'composer-client';
import {BusinessNetworkDefinition} from 'composer-common';
import {AdminConnection} from 'composer-admin';
import {Identity} from '../domain/Identity';

export class BusinessNetworkHandler {
  private businessNetworkDefinition: BusinessNetworkDefinition;

  public constructor(private businessNetworkConnection: BusinessNetworkConnection) {
  }

  public async connect(identity: Identity, connectionProfile: string): Promise<void> {
    try {
      this.businessNetworkDefinition = await this.businessNetworkConnection.connect(
        connectionProfile, Config.settings.composer.network, identity.userID, identity.userSecret
      );
    } catch (error) {
      console.log('Failed to connect. Error: ', error);
    }
  }

  public async connectAsAdmin(identity: Identity, connectionProfile: string): Promise<void> {
    try {
      const adminConnection: AdminConnection = new AdminConnection();
      this.businessNetworkDefinition         = await adminConnection.connect(
        connectionProfile, Config.settings.composer.network, identity.userID, identity.userSecret
      );
    } catch (error) {
      console.log('Failed to connect. Error: ', error);
    }
  }

  public disconnect(): Promise<void> {
    return this.businessNetworkConnection.disconnect();
  }

  public ping(): Promise<any> {
    return this.businessNetworkConnection.ping();
  }

  public getSerializer(rawResource: any): any {
    return this.businessNetworkDefinition.getSerializer().toJSON(rawResource);
  }

  public getFactory(): Promise<any> {
    return this.businessNetworkDefinition.getFactory();
  }

  public submitTransaction(transaction: any): Promise<any> {
    return this.businessNetworkConnection.submitTransaction(transaction);
  }

  public getAssetRegistry(assetRegistry: string): Promise<any> {
    return this.businessNetworkConnection.getAssetRegistry(assetRegistry);
  }

  public getParticipantRegistry(participantRegistry: string): Promise<ParticipantRegisty> {
    return this.businessNetworkConnection.getParticipantRegistry(participantRegistry);
  }

  public issueIdentity(participantIdentifier: string, identityName: string): Promise<Identity> {
    return this.businessNetworkConnection.issueIdentity(participantIdentifier, identityName);
  }

  public query(queryName: string, parameters?: any): Promise<any> {
    return this.businessNetworkConnection.query(queryName, parameters);
  }
}
