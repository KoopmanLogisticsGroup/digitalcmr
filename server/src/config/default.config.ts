import {Settings} from './settings.interface';
import * as winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiPath:      '/api/v1',
      env:          process.env.NODE_ENV || '',
      host:         process.env.VCAP_HOST || process.env.HOST || '0.0.0.0',
      port:         process.env.VCAP_PORT || process.env.PORT || '8080',
      morgan:       {},
      winston:      {
        transports:  [
          new winston.transports.Console({
            level:            'debug',
            prettyPrint:      true,
            handleExceptions: true,
            json:             false,
            colorize:         true
          })
        ],
        exitOnError: false
      },
      serverSecret: 'sUp4hS3cr37kE9c0D3',
      composer:     {
        channel:    process.env.COMPOSER_CHANNEL || '',
        profile:    process.env.COMPOSER_PROFILE || '',
        network:    process.env.COMPOSER_NETWORK || '',
        namespace:  process.env.COMPOSER_NAMESPACE || ''
      },
      privateDB:    {
        host: process.env.COUCHDB_HOST || '',
        port: process.env.COUCHDB_PORT || ''
      }
    };
  }
}
