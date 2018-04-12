import {Settings} from './settings.interface';

export class LocalConfig {
  public static get settings(): Settings {
    return {
      composer:  {
        profile:   'defaultProfile',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB: {
        host: 'privatedb',
        port: '5984'
      }
    };
  }
}
