import {Settings} from './settings.interface';

export class PonLocalConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'pon-local',
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
