import {Settings} from './settings.interface';

export class KpmPonDevConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-pon-dev',
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
