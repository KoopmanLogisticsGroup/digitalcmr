import {Settings} from './settings.interface';

export class StagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'staging',
        network:   'digital-cmr-network',
        channel:   'channel1',
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
