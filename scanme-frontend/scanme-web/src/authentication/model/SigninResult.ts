import {Module, UserAccount} from '../../core';
import {SigninStatus} from './SigninStatus';

export interface SigninResult {
  user: UserAccount;
  status: SigninStatus;
  message: string;
}
