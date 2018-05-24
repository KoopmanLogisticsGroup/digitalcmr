import {Settings} from './settings.interface';

export class AllProdConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'all-staging',
        network:   'digital-cmr-network',
        channel:   'kpmallchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-all',
        port: '5984'
      }
    };
  }
}
