import {LocationInterface} from './location.interface';
import {SignatureInterface} from './signature.interface';
import {AddressInterface} from './address.interface';
import {GoodInterface} from './good.interface';

export interface EcmrInterface {
  ecmrID: string;
  legalOwnerRef: string;
  compoundRef: string;
  carrierRef: string;
  recipientRef: string;
  issuedDate: number;
  issuedBy: string;
  owner: string;
  source: string;
  carrier: string;
  recipient?: string;
  transporter?: string;
  carrierComments: string;
  deliveryAddress: AddressInterface;
  deliveryDate: number;
  loadingAddress: AddressInterface;
  loadingDate: number;
  documents?: string[]
  legalOwnerInstructions: string;
  paymentInstructions: string;
  creation: LocationInterface
  payOnDelivery: string;
  status: string;
  loading: LocationInterface;
  compoundSignature?: SignatureInterface;
  carrierLoadingSignature?: SignatureInterface;
  delivery: LocationInterface;
  carrierDeliverySignature?: SignatureInterface;
  recipientSignature?: SignatureInterface;
  goods: GoodInterface[];
}

