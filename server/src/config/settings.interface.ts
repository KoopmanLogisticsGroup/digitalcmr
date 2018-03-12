import {LoggerOptions} from 'winston';
import {Options} from 'morgan';

export interface Settings {
  apiPath?: string;
  composer: {
    channel: string;
    profile: string;
    network?: string;
    namespace: string;
  };
  env?: string;
  host: string;
  morgan?: Options;
  port?: number | string;
  winston?: LoggerOptions;
  serverSecret: string;
  privateDB: {
    host: string,
    port: string
  };
}
