import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        profile:   'production',
        network:   'digital-cmr-network',
        channel:   'channel1',
        namespace: 'org.digitalcmr'
      },
      host:         process.env.VCAP_HOST || process.env.HOST || '',
      port:         process.env.VCAP_PORT || process.env.PORT || '',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'privatedb',
        port: '5984'
      }
    };
  }
}
