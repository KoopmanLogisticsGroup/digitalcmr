import {LoadingInterface} from './loading.interface';
import {SignatureInterface} from './signature.interface';
import {GoodsInterface} from './goods.interface';
import {RemarkInterface} from './remark.interface';
import {UserBlockchainInterface} from './user.blockchain.interface';
import {AddressInterface} from './address.interface';
import {CancellationInterface} from './cancellation.interface';

export interface EcmrInterface {
  ecmrID: string,
  orderID: string,
  agreementTerms: string,
  legalOwnerRef: string,
  compoundRef: string,
  carrierRef: string,
  RecipientRef: string,
  issuedDate: number,
  issuedBy: UserBlockchainInterface,
  legalOwner: UserBlockchainInterface,
  compound: UserBlockchainInterface,
  carrier: UserBlockchainInterface,
  recipient: UserBlockchainInterface,
  carrierComments: RemarkInterface,
  deliveryAddress: AddressInterface,
  deliveryDate: number,
  loadingAddress: AddressInterface,
  loadingDate: number,
  documents: string[]
  legalOwnerInstructions: string,
  paymentInstructions: string,
  creationAddress: AddressInterface,
  creationDate: number,
  payOnDelivery: string,
  status: string,
  owner: string,
  cancellation: CancellationInterface,
  loading: LoadingInterface,
  compoundSignature: SignatureInterface,
  carrierLoadingSignature: SignatureInterface,
  delivery: LoadingInterface,
  generalRemark: RemarkInterface,
  carrierDeliverySignature: SignatureInterface,
  recipientSignature: SignatureInterface,
  goods: GoodsInterface[]
}
