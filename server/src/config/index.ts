import {DefaultConfig} from './default.config';
import {DevelopmentConfig} from './development.config';
import {Settings} from './settings.interface';

export class Config {
    private static shallowMerge(a: Settings, b: Settings): Settings {
        Object.keys(b).forEach(key => {
            a[key] = b[key];
        });
        return a;
    }

    public static get settings(): Settings {
        const defaultSettings = DefaultConfig.settings;
        let envSettings: Settings;

        switch (process.env.NODE_ENV) {
            case 'development':
                envSettings = DevelopmentConfig.settings;
                break;
            default:
                console.warn('No environment settings.'); // TODO use logger
                return defaultSettings;
        }

        // Shallow merge
        return this.shallowMerge(defaultSettings, envSettings);
    }
}