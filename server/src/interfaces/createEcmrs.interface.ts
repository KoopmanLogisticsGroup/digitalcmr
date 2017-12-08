import {Ecmr} from './ecmr.interface';

export interface CreateEcmrs {
  orderID: string;
  ecmrs: Ecmr[];
}