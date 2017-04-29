import {Settings} from '.';

export class DevelopmentConfig {
    public static get settings(): Settings {
        return {
            composer: {
                url: 'http://composer:3000/api',
            }
        };
    }
}