import {Settings} from './settings.interface';

export class StagingConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        url:       'http://159.122.179.221:31090/api',
        profile:   'staging',
        network:   'digital-cmr-network',
        channel:   'channel1',
        namespace: 'org.digitalcmr'
      },
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'persistent-privatedb',
        port: '5984'
      }
    };
  }
}
