import {Good} from './good.interface';
import {Loading} from './loading.interface';
import {Cancellation} from './cancellation.interface';
import {Delivery} from './delivery.interface';

export interface TransportOrder {
  orderID: string;
  loading: Loading;
  delivery: Delivery;
  owner: string;
  source: string;
  carrier: string;
  goods: Good[];
  status: string;
  issueDate: number;
  ecmrs: string[];
  orderRef: string;
  cancellation?: Cancellation;
}
