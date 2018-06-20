import {Settings} from './settings.interface';

export class AllStagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'all-staging',
        network:   'digital-cmr-network',
        channel:   'kpmallstagchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-all',
        port: '5984'
      }
    };
  }
}
