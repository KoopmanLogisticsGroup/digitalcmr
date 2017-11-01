import {RemarkInterface} from './remark.interface';
import {VehicleInterface} from './vehicle.interface';

export interface GoodInterface {
  vehicle: VehicleInterface;
  compoundRemark: RemarkInterface;
  carrierLoadingRemark: RemarkInterface;
  carrierDeliveryRemark: RemarkInterface;
  recipientRemark: RemarkInterface;
  description: string;
  weight: number;
}
