import {Module} from './Module';

export interface UserAccount {
  userId: string;
  userName: string;
  email: string;
  displayName: string;
  imageURL?: string;
  passwordExpiredTime: Date;
  token: string;
  tokenExpiredDate: Date;
  newUser: boolean;
  language: string;
  dateFormat: string;
  privileges: string[];
  userType: string;
  modules: Module[];
  providerId: string;
}
