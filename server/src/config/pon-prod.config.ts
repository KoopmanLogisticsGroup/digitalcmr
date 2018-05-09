import {Settings} from './settings.interface';

export class PonProdConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'pon-prod',
        network:   'digital-cmr-network',
        channel:   'kpmponchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-pon',
        port: '5984'
      }
    };
  }
}
