import {Settings} from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'defaultProfile',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'privatedb',
        port: '5984'
      }
    };
  }
}
