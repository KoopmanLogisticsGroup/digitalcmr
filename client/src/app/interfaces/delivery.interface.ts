import {Address} from './address.interface';

export interface Delivery {
  address: Address;
  expectedWindow?: number;
  actualDate?: number;
}
