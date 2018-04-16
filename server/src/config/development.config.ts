import {Settings} from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'development',
        network:   'digital-cmr-network',
        channel:   'channel1',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb',
        port: '5984'
      }
    };
  }
}
