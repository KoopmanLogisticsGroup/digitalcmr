import {AddressInterface} from './address.interface';

export interface EntityInterface {
  entityID: string;
  name: string;
  address: AddressInterface;
}
