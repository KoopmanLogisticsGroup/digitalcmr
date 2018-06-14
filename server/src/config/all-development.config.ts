import {Settings} from './settings.interface';

export class AllDevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'all-development',
        network:   'digital-cmr-network',
        channel:   'kpmalldevchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-all',
        port: '5984'
      }
    };
  }
}
