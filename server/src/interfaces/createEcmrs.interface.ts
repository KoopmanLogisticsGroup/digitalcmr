import {Ecmr} from './ecmr.interface';

export interface CreateEcmrs {
  transportOrderID: string;
  ecmrs: Ecmr[];
}