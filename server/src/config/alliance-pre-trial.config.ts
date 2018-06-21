import {Settings} from './settings.interface';

export class AlliancePreTrialConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'alliance-pre-trial',
        network:   'digital-cmr-network',
        channel:   'kpmalliancepretrialchannel',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb-all',
        port: '5984'
      }
    };
  }
}
