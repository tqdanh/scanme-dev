import {UserAccount} from '../UserAccount';

export interface PermissionBuilder<T> {
  buildPermission(user: UserAccount, url: string): T;
}
