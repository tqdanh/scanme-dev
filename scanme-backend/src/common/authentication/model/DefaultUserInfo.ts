import { UserInfo } from './UserInfo';

export class DefaultUserInfo implements UserInfo {
  userId: string;
  userName: string;
  email: string;
  displayName: string;
  password: string;
  disable: boolean;
  deactivated: boolean;
  suspended: boolean;
  lockedUntilTime: Date;
  successTime: Date;
  failTime: Date;
  failCount: number;
  passwordModifiedTime: Date;
  maxPasswordAge: number;
  roles: string[];
  organizationId: string;
}
