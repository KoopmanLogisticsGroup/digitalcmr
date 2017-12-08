import {Address} from './address.interface';

export interface Loading {
  address: Address;
  expectedWindow?: number;
  actualDate?: number;
}
