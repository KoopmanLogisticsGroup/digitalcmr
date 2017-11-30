export interface Cancellation {
  cancelledBy: string;
  date: number;
  reason: string;
}

export interface EcmrCancellation {
  ecmrID: string;
  cancellation: {
    cancelledBy: string;
    date: number;
    reason: string;
  };
}

export interface TransportOrderCancellation {
  orderID: string;
  cancellation: {
    cancelledBy: string;
    date: number;
    reason: string;
  };
}