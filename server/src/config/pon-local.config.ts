import {Settings} from './settings.interface';

export class PonDevConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'pon-dev',
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
