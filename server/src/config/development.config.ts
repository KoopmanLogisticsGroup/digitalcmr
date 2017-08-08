import {Settings} from './settings.interface';

export class DevelopmentConfig {
  public static get settings(): Settings {
    return {
      composer: {
        url:       'http://composer:3000/api',
        profile:   'defaultProfile',
        network:   'digital-cmr-network',
        channel:   'composerchannel',
        namespace: 'org.digitalcmr'
      },
    };
  }
}
