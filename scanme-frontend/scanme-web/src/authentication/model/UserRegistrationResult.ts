import {ErrorMessage} from '../../core';

export interface UserRegistrationResult {
  success: boolean;
  message: string;
  errors: ErrorMessage[];
}
