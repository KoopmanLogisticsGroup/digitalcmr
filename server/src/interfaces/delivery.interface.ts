import {Address} from './address.interface';
import {DateWindow} from './dateWindow.interface';

export interface Delivery {
  address: Address;
    expectedWindow?: DateWindow;
  actualDate?: number;
}
