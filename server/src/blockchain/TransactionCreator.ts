import {Factory} from 'composer-common';
import {TransportOrder} from '../../../client/src/app/interfaces/transportOrder.interface';
import {DateWindow} from '../../resources/interfaces/date.window.interface';

export interface TransactionCreator {
  create(factory: Factory, namespace: string, resource: any, ...optionals: any[]): Promise<any>;

  update(factory: Factory, namespace: string, resource: any, resourceID: string, ...optionals: any[]): Promise<any>;

  // updateTransportOrderPickupWindow(factory: Factory, namespace: string, transportOrder: TransportOrder, vin: string, pickupWindow: DateWindow, ...optionals: any[]): Promise<any>;
}