import {Settings} from './settings.interface';

export class KpmAllProdConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-all-prod',
        network:   'digital-cmr-network',
        channel:   'kpmallchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-all',
        port: '5984'
      }
    };
  }
}
