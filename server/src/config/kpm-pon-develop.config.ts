import {Settings} from './settings.interface';

export class KpmPonDevelopConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-pon-develop',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'privatedb-kpm-pon',
        port: '5984'
      }
    };
  }
}
