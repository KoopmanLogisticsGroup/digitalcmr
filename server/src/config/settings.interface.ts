import {LoggerOptions} from 'winston';
import {Options} from 'morgan';
export interface Settings {
    apiPath?: string;
    composer?: {
        url: string,
    };
    env?: string;
    host?: string;
    morgan?: Options;
    port?: number;
    winston?: LoggerOptions;
  secret?: string;
  serverDir?: string;
}
