import * as debug from 'debug';
import {DefaultConfig} from './default.config';
import {LocalConfig} from './local';
import {Settings} from './settings.interface';
import {PonStagingConfig} from './pon-staging.config';
import {KpmPonProdConfig} from './kpm-pon-prod.config';
import {PonProdConfig} from './pon-prod.config';
import {DevelopmentConfig} from './development.config';
import {KpmPonStagingConfig} from './kpm-pon-staging.config';
import {PonLocalConfig} from './pon-local.config';
import {KpmPonLocalConfig} from './kpm-pon-local.config';

export class Config {
  private static NAMESPACE: string = 'app:config';
  private static combinedSettings: Settings;

  /**
   * Merge two settings. Only the top level keys are considered!
   * @param a: Settings the default settings
   * @param b: Settings environment settings
   * @returns {Settings}
   */
  private static shallowMerge(a: Settings, b: Settings): Settings {
    Object.keys(b).forEach(key => {
      if (b[key] === null) {
        debug(this.NAMESPACE)(`WARNING: key is null: ${key}`);
      } else {
        a[key] = b[key];
      }
    });
    debug(this.NAMESPACE)('merged settings:', a);

    return a;
  }

  /**
   * Get settings based on NODE_ENV.
   * @returns {Settings}
   */
  public static get settings(): Settings {
    if (this.combinedSettings !== undefined && this.combinedSettings !== null) {
      return this.combinedSettings;
    }

    debug(this.NAMESPACE)('process.env.NODE_ENV', process.env.NODE_ENV);
    const defaultSettings = DefaultConfig.settings;
    let envSettings: Settings;
    switch (process.env.NODE_ENV) {
      case 'local':
        envSettings = LocalConfig.settings;
        break;
      case 'development':
        envSettings = DevelopmentConfig.settings;
        break;
      case 'kpm-pon-local':
        envSettings = KpmPonLocalConfig.settings;
        break;
      case 'kpm-pon-staging':
        envSettings = KpmPonStagingConfig.settings;
        break;
      case 'kpm-pon-prod':
        envSettings = KpmPonProdConfig.settings;
        break;
      case 'pon-local':
        envSettings = PonLocalConfig.settings;
        break;
      case 'pon-staging':
        envSettings = PonStagingConfig.settings;
        break;
      case 'pon-prod':
        envSettings = PonProdConfig.settings;
        break;
      default:
        debug(this.NAMESPACE)(`WARNING: no environment settings for ${process.env.NODE_ENV}.`);
        this.combinedSettings = defaultSettings;

        return defaultSettings;
    }

    // Shallow merge
    debug(this.NAMESPACE)('default settings', defaultSettings);
    debug(this.NAMESPACE)(`${process.env.NODE_ENV} settings`, envSettings);
    this.combinedSettings = this.shallowMerge(defaultSettings, envSettings);

    return this.combinedSettings;
  }
}