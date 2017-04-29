import {Settings} from '.';

export class DefaultConfig {
    public static get settings(): Settings {
        return {
            env: process.env.NODE_ENV,
        };
    }
}