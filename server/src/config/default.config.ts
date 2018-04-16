import {Settings} from './settings.interface';
import * as winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiPath:      '/api/v1',
      env:          process.env.NODE_ENV,
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
        channel:   'composerchannel',
        profile:   'defaultProfile',
        network:   'digital-cmr-network',
        namespace: 'org.digitalcmr'
      },
      privateDB:    {
        host: 'privatedb',
        port: '5984'
      }
    };
  }
}
