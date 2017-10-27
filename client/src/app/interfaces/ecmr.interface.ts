import {LoadingInterface} from './loading.interface';
import {SignatureInterface} from './signature.interface';
import {GoodsInterface} from './goods.interface';
import {RemarkInterface} from './remark.interface';

export interface EcmrInterface {
  status: string,
  owner: string,
  loading: LoadingInterface,
  compoundSignature: SignatureInterface,
  carrierLoadingSignature: SignatureInterface,
  delivery: LoadingInterface,
  generalRemark: RemarkInterface,
  carrierDeliverySignature: SignatureInterface,
  recipientSignature: SignatureInterface,
  goods: GoodsInterface[]
}
