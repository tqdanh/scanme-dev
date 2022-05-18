import { SigninStatus } from './SigninStatus';
import {UserAccount} from './UserAccount';

export class SigninResult {
  status: SigninStatus;
  user?: UserAccount;
  message?: string;
}
