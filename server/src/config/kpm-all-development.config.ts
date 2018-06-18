import {Settings} from './settings.interface';

export class KpmAllDevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-all-development',
        network:   'digital-cmr-network',
        channel:   'kpmalldevchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-all',
        port: '5984'
      }
    };
  }
}
