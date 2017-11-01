import {Entity} from '../../src/domain/Entity';

export interface UserBlockchainInterface {
  userID: string;
  username: string;
  firstName:  string;
  lastName: string;
  org:  Entity;
}
