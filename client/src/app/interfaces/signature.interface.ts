import {RemarkInterface} from './remark.interface';

export interface SignatureInterface {
  longitude: number,
  latitude: number,
  certificate: string,
  generalRemark:  RemarkInterface
}
