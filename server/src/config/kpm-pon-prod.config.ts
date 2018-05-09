import {Settings} from './settings.interface';

export class KpmPonProdConfig {
  public static get settings(): Settings {
    return {
      composer:  {
        profile:   'kpm-pon-prod',
        network:   'digital-cmr-network',
        channel:   'kpmponchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB: {
        host: 'privatedb-kpm-pon',
        port: '5984'
      }
    };
  }
}
