export interface Cancellation {
  cancelledBy: string;
  date: number;
  reason: string;
}

export interface EcmrCancellation {
  ecmrID: string;
  cancellation: Cancellation;
}

export interface TransportOrderCancellation {
  orderID: string;
  cancellation: Cancellation;
}