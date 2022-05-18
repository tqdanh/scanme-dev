import {Observable, of} from 'rxjs';

import {GenericRepository} from '../../../core';
import {InviteAuthorization, ResourceType} from '../../authorization-model';

export interface InviteAuthorizationRepository extends GenericRepository<InviteAuthorization> {
  findOneByResourceIdAndResourceTypeAndEmail(resourceId: string, resourceType: ResourceType, email: string): Observable<InviteAuthorization>;
  findByEmail(email: string): Observable<InviteAuthorization[]>;
  findByResourceIdAndResourceType(resourceId: string, resourceType: ResourceType): Observable<InviteAuthorization[]>;

  deleteOneByResourceIdAndResourceTypeAndEmailAndRoleId(resourceId: string, resourceType: ResourceType, email: string, roleId: string): Observable<boolean>;
}
