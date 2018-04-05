import {Settings} from './settings.interface';

export class PonDevConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'kpm-pon-dev',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'privatedb-pon',
        port: '5984'
      }
    };
  }
}
