import {Observable, of} from 'rxjs';
import {OrganizationRegistration} from '../model/OrganizationRegistration';
import {OrganizationRegistrationResult} from '../model/OrganizationRegistrationResult';
import {UserRegistration} from '../model/UserRegistration';
import {UserRegistrationResult} from '../model/UserRegistrationResult';

export interface OrganizationRegistrationService {
  registerOrganization(organization: OrganizationRegistration): Observable<OrganizationRegistrationResult>;
}
