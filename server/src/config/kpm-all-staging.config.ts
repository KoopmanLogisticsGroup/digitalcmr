import {Settings} from './settings.interface';

export class KpmAllStagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-all-staging',
        network:   'digital-cmr-network',
        channel:   'kpmallstagchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-all',
        port: '5984'
      }
    };
  }
}
