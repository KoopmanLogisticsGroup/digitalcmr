import {RemarkInterface} from './remark.interface';

export interface SignatureInterface {
  longitude: number,
  latitude: number,
  certificate: string,
  timestamp: number,
  generalRemark:  RemarkInterface
}
