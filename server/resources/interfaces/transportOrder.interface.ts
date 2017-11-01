import {GoodInterface} from './good.interface';
import {CancellationInterface} from './cancellation.interface';
import {LoadingInterface} from './loading.interface';
import {OrderStatusEnum} from './order.status.enum';

export interface TransportOrderInterface {
  orderID: string;
  creation: LoadingInterface;
  loading: LoadingInterface;
  delivery: LoadingInterface;
  owner: string;
  source: string;
  carrier: string;
  goods: GoodInterface[];
  status: OrderStatusEnum;
  issueDate: number;
  ecmrs: string[];
  orderRef: string;
  cancellation?: CancellationInterface;
}