import {ErrorMessage} from '../../core';
import {UserRegistrationResult} from './UserRegistrationResult';

export interface OrganizationRegistrationResult extends UserRegistrationResult {
  success: boolean;
  message?: string;
  errors: ErrorMessage[];
}
