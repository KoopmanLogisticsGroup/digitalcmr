import {Container} from 'typedi';
import {Connection} from './entities/Connection';
import {Identity} from '../identities/entities/Identity';
import {Config} from '../../config/index';
import {BusinessNetworkHandler} from '../blockchain/BusinessNetworkHandler';
import {LoggerFactory} from '../../utils/logger/LoggerFactory';
import {LoggerInstance} from 'winston';
import * as ComposerClient from 'composer-client';

export class ConnectionFactory {
  private logger: LoggerInstance;

  public constructor() {
    this.logger = Container.get(LoggerFactory).get('ConnectionFactory');
  }

  public async create(identity: Identity): Promise<Connection> {
    try {
      const businessNetworkHandler = new BusinessNetworkHandler(new ComposerClient.BusinessNetworkConnection());
      await businessNetworkHandler.connect(identity, Config.settings.composer.profile);

      return new Connection(businessNetworkHandler, businessNetworkHandler.getFactory(), businessNetworkHandler.getSerializer());
    } catch (error) {
      this.logger.error('Failed to create connection for identity: ', identity);
      throw  error;
    }
  }
}
