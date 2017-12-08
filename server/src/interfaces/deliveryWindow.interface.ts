import {DateWindow} from './dateWindow.interface';

export interface DeliveryWindow {
  orderID: string;
  vin: string;
  dateWindow: DateWindow;
}