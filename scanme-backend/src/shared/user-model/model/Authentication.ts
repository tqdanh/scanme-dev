export class Authentication {
  userId: string;
  password: string;
  lockedUntilTime: Date;
  successTime: Date;
  failTime: Date;
  failCount: number;
  passwordModifiedTime: Date;
}
