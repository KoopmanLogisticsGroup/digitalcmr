import {Address} from './address.interface';
import {DateWindow} from './dateWindow.interface';

export interface Loading {
  address: Address;
    expectedWindow?: DateWindow;
  actualDate?: number;
}
