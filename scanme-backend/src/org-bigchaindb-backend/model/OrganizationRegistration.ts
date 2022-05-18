import {Gender} from '../../core';
import {UserRegistration} from './UserRegistration';

export interface OrganizationRegistration extends UserRegistration {
  userName: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  organizationName: string;
  organizationType: string;
  organizationAddress: string;
  organizationPhone: string;
}
