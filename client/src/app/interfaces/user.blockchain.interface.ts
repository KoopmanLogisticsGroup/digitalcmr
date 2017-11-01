import {EntityInterface} from './entity.interface';

export interface UserBlockchainInterface {
  userID: string;
  username: string;
  firstName:  string;
  lastName: string;
  org:  EntityInterface;
}
