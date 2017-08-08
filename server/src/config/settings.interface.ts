import {LoggerOptions} from 'winston';
import {Options} from 'morgan';

export interface Settings {
  apiPath?: string;
  composer?: {
    url: string;
    profile?: string;
    network?: string;
    channel?: string;
    namespace?: string;
  };
  env?: string;
  host?: string;
  morgan?: Options;
  port?: number;
  winston?: LoggerOptions;
  secret?: string;
  serverDir?: string;
}
