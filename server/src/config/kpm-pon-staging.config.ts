import {Settings} from './settings.interface';

export class KpmPonStagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-pon-staging',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-pon',
        port: '5984'
      }
    };
  }
}
