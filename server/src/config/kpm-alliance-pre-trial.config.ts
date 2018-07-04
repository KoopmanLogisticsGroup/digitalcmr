import {Settings} from './settings.interface';

export class KpmAlliancePreTrialConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-alliance-pre-trial',
        network:   'digital-cmr-network',
        channel:   'kpmalliancepretrialchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-kpm-all',
        port: '5984'
      }
    };
  }
}
