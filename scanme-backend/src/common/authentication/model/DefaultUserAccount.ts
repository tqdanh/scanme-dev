import {UserAccount} from './UserAccount';

export class DefaultUserAccount implements UserAccount {
  userId: string;
  userName: string;
  email: string;
  displayName: string;
  passwordExpiredTime: Date;
  token: string;
  tokenExpiredDate: Date;
  newUser: boolean;
  roleType: string;
  privileges: string[];
  accessDateFrom: Date;
  accessDateTo: Date;
  accessTimeFrom: string;
  accessTimeTo: string;
  modules?: any;
  providerId: string;
}
