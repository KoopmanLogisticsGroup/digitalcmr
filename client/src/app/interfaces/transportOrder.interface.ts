import {AddressInterface} from './address.interface';
import {UserBlockchainInterface} from './user.blockchain.interface';

export interface TransportOrderInterface {
  orderID: string;
  loadingAddress: AddressInterface;
  deliveryAddress: AddressInterface;
  carrier: UserBlockchainInterface;
  compound: UserBlockchainInterface;
  goods: UserBlockchainInterface;
  status: string;
  issueDate: number;
  ecmrs: string[];
  orderRef: string;
}
