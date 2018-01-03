import {Good} from './good.interface';
import {Signature} from './signature.interface';

export interface UpdateEcmrStatus {
  ecmrID: string;
  goods: Good[];
  signature: Signature;
  orderID?: string;
}
