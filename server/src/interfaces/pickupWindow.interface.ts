import {DateWindow} from './dateWindow.interface';

export interface PickupWindow {
  orderID: string;
  vin: string;
  dateWindow: DateWindow;
}