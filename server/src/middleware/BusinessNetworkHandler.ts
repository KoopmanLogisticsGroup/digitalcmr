import * as ComposerClient from 'composer-client';
import {Config} from '../config';

export class BusinessNetworkHandler {
  private businessNetworkConnection: any;
  private businessNetworkDefinition: any;
  private connectionProfile: string;
  private networkName: string;

  public constructor(private username: string, private secret: string) {
    this.businessNetworkConnection = new ComposerClient.BusinessNetworkConnection();
    this.networkName               = Config.settings.composer.network;
    this.connectionProfile         = Config.settings.composer.profile;
  }

  public async connect(): Promise<any> {
    this.businessNetworkDefinition = await this.businessNetworkConnection.connect(
      this.connectionProfile, this.networkName, this.username, this.secret
    );

    return this.businessNetworkConnection;
  }

  public disconnect(): Promise<any> {
    return this.businessNetworkConnection.disconnect();
  }

  public ping(): Promise<void> {
    return this.businessNetworkConnection.ping();
  }

  public getSerializer(): any {
    return this.businessNetworkDefinition.getSerializer();
  }

  public getFactory(): any {
    return this.businessNetworkDefinition.getFactory();
  }
}
