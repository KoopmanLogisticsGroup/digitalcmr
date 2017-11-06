import {Address} from './address.interface';

export interface Delivery {
  address: Address;
  expectedDate?: number;
  actualDate?: number;
}
