import {Observable, of} from 'rxjs';
import {UserRegistrationForOrganization} from '../model/UserRegistrationForOrganization';
import {UserRegistrationResult} from '../model/UserRegistrationResult';

export interface UserRegistrationService {
  registerUser(user: UserRegistrationForOrganization): Observable<UserRegistrationResult>;
  confirmOrg(userId: string, passcode: string): Observable<boolean>;
  confirmUser(userId: string, passcode: string): Observable<boolean>;
  // hackUserPass(userId: string, password: string): Observable<any>;
}
