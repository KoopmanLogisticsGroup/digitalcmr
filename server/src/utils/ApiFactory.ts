import {Authentication} from '../sdk/api';
import {Service} from 'typedi';

interface Api {
  basePath: string;
  defaultHeaders: any;
  useQuerystring: boolean;
  authentications: {
    'default': Authentication,
  };

  constructor(basePath?: string): void;

  constructor(basePathOrUsername: string, password?: string, basePath?: string): void;

  setApiKey(key: any, value: string): void;
}

@Service()
export class ApiFactory {
  public constructor(private baseUrl: string) {
  }

  public get<Api>(type: { new(basePath?: string): Api; }): Api {
    return new type(this.baseUrl);
  }
}
