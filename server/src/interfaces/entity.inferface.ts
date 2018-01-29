import {Address} from './address.interface';

export interface Entity {
  participant: Participant;
  identity: Identity;
  userApp: UserInfo;
}

export interface Participant {
  participantID: string;
  $class: string;
  org: string;
  userID: string;
  userName: string;
  firstName: string;
  lastName: string;
  address: Address;
}

export interface Identity {
  userID: string;
  userSecret: string;
}

export interface UserInfo {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  identity?: Identity;
}

export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: Address;
  orgType: string;
  orgID: string;
  role: string;
}