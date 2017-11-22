import {Address} from './address.interface';

export interface Loading {
  address: Address;
  expectedDate?: number;
  actualDate?: number;
}
