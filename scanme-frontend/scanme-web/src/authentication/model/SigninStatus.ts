export enum SigninStatus {
  WrongPassword = '-1',
  Fail = '0',
  Success = '1', // 'S',
  SuccessAndReactivated = '2',
  PasswordExpired = '4',
  Locked = '8',
  Suspended = '16',
  Deactivated = '32', // deleted
  SecurityError = '64', // 'R',
  SystemError = '128',
}
