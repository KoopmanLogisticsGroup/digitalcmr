import {Settings} from './settings.interface';
import * as winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiPath:      '/api/v1',
      env:          process.env.NODE_ENV,
      host:         '0.0.0.0',
      morgan:       {},
      port:         '8080',
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
        url:       'http://composer-rest-server:3000/api',
        channel:   'composerchannel',
        profile:   'defaultProfile',
        network:   'basic-sample-network',
        namespace: 'org.acme.sample'
      },
      privateDB:    {
        host: 'private-db',
        port: '5984'
      }
    };
  }
}
