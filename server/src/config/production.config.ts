import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      composer: {
        url:       'http://169.51.10.201:31090/api',
        profile:   'production',
        network:   'digital-cmr-network',
        channel:   'channel1',
        namespace: 'org.digitalcmr'
      },
      host:     process.env.VCAP_HOST || process.env.HOST,
      port:     process.env.VCAP_PORT || process.env.PORT,
    };
  }
}
