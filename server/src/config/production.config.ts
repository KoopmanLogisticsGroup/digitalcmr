import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      composer:     {
        url:       'http://159.8.76.83:31090/api',
        profile:   'production',
        network:   'digital-cmr-network',
        channel:   'channel1',
        namespace: 'org.digitalcmr'
      },
      host:         process.env.VCAP_HOST || process.env.HOST || '',
      port:         process.env.VCAP_PORT || process.env.PORT || '',
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      privateDB:    {
        host: 'couchdb-private',
        port: '5984'
      }
    };
  }
}
