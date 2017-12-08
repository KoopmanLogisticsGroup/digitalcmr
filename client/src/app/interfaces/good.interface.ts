import {Remark} from './remark.interface';
import {Vehicle} from './vehicle.interface';
import {Cancellation} from './cancellation.interface';
import {DateWindow} from './dateWindow.interface';

export interface Good {
  vehicle: Vehicle;
  compoundRemark?: Remark;
  carrierLoadingRemark?: Remark;
  carrierDeliveryRemark?: Remark;
  recipientRemark?: Remark;
  description?: string;
  weight?: number;
  pickupWindow: DateWindow;
  deliveryWindow: DateWindow;
  cancellation?: Cancellation;
}
