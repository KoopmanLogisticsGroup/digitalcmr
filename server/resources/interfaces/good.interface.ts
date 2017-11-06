import {Remark} from './remark.interface';
import {Vehicle} from './vehicle.interface';
import {Cancellation} from './cancellation.interface';

export interface Good {
  vehicle: Vehicle;
  compoundRemark?: Remark;
  carrierLoadingRemark?: Remark;
  carrierDeliveryRemark?: Remark;
  recipientRemark?: Remark;
  description?: string;
  weight?: number;
  loadingStartDate: number;
  loadingEndDate: number;
  deliveryStartDate: number;
  deliveryEndDate: number;
  cancellation?: Cancellation;
}
