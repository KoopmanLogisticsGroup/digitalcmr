import {Settings} from './settings.interface';
import * as winston from 'winston';
import * as path from 'path';

export class DefaultConfig {
    public static get settings(): Settings {
        return {
            apiPath: '/api/v1',
            env: process.env.NODE_ENV,
            host: '0.0.0.0',
            morgan: {},
            port: 8080,
            winston: {
                transports: [
                    new winston.transports.Console({
                        level: 'debug',
                        prettyPrint: true,
                        handleExceptions: true,
                        json: false,
                        colorize: true
                    })
                ],
                exitOnError: false
            },
          secret:    'sUp4hS3cr37kE9c0D3',
          serverDir: path.join(process.cwd(), 'dist')
        };
    }
}
