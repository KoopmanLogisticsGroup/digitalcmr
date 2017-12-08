import {Remark} from './remark.interface';

export interface Signature {
  longitude?: number;
  latitude?: number;
  certificate?: string;
  timestamp: number;
  ip?: string;
  generalRemark?: Remark;
}
