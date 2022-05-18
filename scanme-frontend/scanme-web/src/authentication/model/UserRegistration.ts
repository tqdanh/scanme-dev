import {Gender} from '../../core';

export interface UserRegistration {
  userName: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
}
