import {UserBlockchainInterface} from './user.blockchain.interface';

export interface CancellationInterface {
  cancelledBy: UserBlockchainInterface;
  date: number;
  reason: string;
}
