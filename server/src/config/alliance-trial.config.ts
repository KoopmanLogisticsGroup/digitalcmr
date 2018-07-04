import {Settings} from './settings.interface';

export class AllianceTrialConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'alliance-trial',
        network:   'digital-cmr-network',
        channel:   'kpmalliancetrialchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-all',
        port: '5984'
      }
    };
  }
}
