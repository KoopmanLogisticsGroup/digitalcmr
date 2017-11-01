import {AddressInterface} from './address.interface';
import {GoodInterface} from './good.interface';

export interface TransportOrderInterface {
  orderID: string;
  loadingAddress: AddressInterface;
  deliveryAddress: AddressInterface;
  carrier: string;
  source: string;
  goods: GoodInterface;
  status: string;
  issueDate: number;
  ecmrs: string[];
  orderRef: string;
}
