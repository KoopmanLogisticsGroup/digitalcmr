import {Settings} from './settings.interface';

export class KpmAllianceTrialConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-alliance-trial',
        network:   'digital-cmr-network',
        channel:   'kpmalliancetrialchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-all',
        port: '5984'
      }
    };
  }
}
