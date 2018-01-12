import {Good} from './good.interface';
import {Cancellation} from './cancellation.interface';

export interface TransportOrder {
  orderID?: string;
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

export enum TransportOrderStatus {
  Open       = 'OPEN',
  InProgress = 'IN_PROGRESS',
  Completed  = 'COMPLETED',
  Cancelled  = 'CANCELLED'
}
