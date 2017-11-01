import {Address} from './Address';
import {Participant} from './Participant';

export class ComposerUser extends Participant {
  public $class: string;
  public org: string;
  public userID: string;
  public userName: string;
  public firstName: string;
  public lastName: string;
  public address: Address;

  public constructor(user: any) {
    super(user.$class, user.participantID);
    this.$class    = user.$class;
    this.org       = user.org;
    this.userID    = user.userID;
    this.userName  = user.userName;
    this.firstName = user.firstName;
    this.lastName  = user.lastName;
    this.address   = user.address;
  }
}
