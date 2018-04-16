import {Settings} from './settings.interface';

export class PonStagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'pon-staging',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-pon',
        port: '5984'
      }
    };
  }
}