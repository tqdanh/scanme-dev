import {Observable, of} from 'rxjs';

import {GenericRepository} from '../../../core';
import {Authorization, ResourceType} from '../../authorization-model';

export interface AuthorizationRepository extends GenericRepository<Authorization> {
  findOneByResourceIdAndResourceTypeAndUserId(resourceId: string, resourceType: ResourceType, userId: string): Observable<Authorization>;
  findByResourceTypeAndUserId(resourceType: ResourceType, userId: string): Observable<Authorization[]>;
  findByResourceIdAndResourceType(resourceId: string, resourceType: ResourceType): Observable<Authorization[]>;

  deleteOneByResourceIdAndResourceTypeAndUserIdAndRoleId(resourceId: string, resourceType: ResourceType, userId: string, roleId: string): Observable<boolean>;
}
