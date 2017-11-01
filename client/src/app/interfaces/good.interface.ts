import {RemarkInterface} from './remark.interface';
import {VehicleInterface} from './vehicle.interface';
import {CancellationInterface} from './cancellation.interface';

export interface GoodInterface {
  refObject: VehicleInterface;
  compoundRemark: RemarkInterface;
  carrierLoadingRemark: RemarkInterface;
  carrierDeliveryRemark: RemarkInterface;
  recipientRemark: RemarkInterface;
  description: string;
  weight: number;
  loadingStartDate: number;
  loadingEndDate: number;
  deliveryStartDate: number;
  deliveryEndDate: number;
  cancellation: CancellationInterface;
}
