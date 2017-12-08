import * as http from 'http';
import {Response} from 'superagent';

export class StatusCode {
  public static ok = (res: Response) => {
    if (res.status !== 200) {
      const status = http.STATUS_CODES[res.status];
      return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  }
}