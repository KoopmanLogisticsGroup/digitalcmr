import {Signature} from './signature.interface';
import {Creation} from './creation.interface';
import {Good} from './good.interface';
import {Cancellation} from './cancellation.interface';
import {Loading} from './loading.interface';
import {Delivery} from './delivery.interface';

export interface Ecmr {
  ecmrID: string;
  agreementTerms: string;
  agreementTermsSec: string;
  legalOwnerRef: string;
  carrierRef: string;
  recipientRef: string;
  issueDate: number;
  issuedBy: string;
  owner: string;
  source: string;
  carrier: string;
  recipient: string;
  carrierComments: String;
  creation: Creation;
  loading: Loading;
  delivery: Delivery;
  documents?: string[];
  goods: Good[];
  legalOwnerInstructions: string;
  paymentInstructions: string;
  payOnDelivery: string;
  compoundSignature?: Signature;
  carrierLoadingSignature?: Signature;
  carrierDeliverySignature?: Signature;
  recipientSignature?: Signature;
  status: EcmrStatus;
  orderID: string;
  cancellation?: Cancellation;
  transporter?: string;
  recipientMember?: string;
}

export enum EcmrStatus {
  Created            = 'CREATED',
  Loaded             = 'LOADED',
  InTransit          = 'IN_TRANSIT',
  Delivered          = 'DELIVERED',
  ConfirmedDelivered = 'CONFIRMED_DELIVERED',
  Cancelled          = 'CANCELLED'
}
