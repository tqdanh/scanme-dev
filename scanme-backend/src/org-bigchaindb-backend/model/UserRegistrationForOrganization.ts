import {Gender} from '../../core';
import {UserRegistration} from './UserRegistration';

export interface UserRegistrationForOrganization extends UserRegistration {
  userName: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  adminId: string;
}
