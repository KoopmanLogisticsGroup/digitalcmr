import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      composer: {
        url: process.env.COMPOSER_URL
      },
      host:     process.env.VCAP_HOST || process.env.HOST,
      port:     process.env.VCAP_PORT || process.env.PORT,
    };
  }
}
