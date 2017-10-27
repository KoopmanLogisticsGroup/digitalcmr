import {AddressInterface} from './address.interface';
import {SignatureInterface} from './signature.interface';

export interface LoadingInterface {
  date: Date,
  address: AddressInterface,
  compoundSignature: SignatureInterface
}
