import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {MongoGenericRepository, MongoUtil} from '../../../mongo-core';
import {Authorization, authorizationModel, ResourceType} from '../../authorization-model';
import {AuthorizationRepository} from '../../authorization-repository';

export class AuthorizationRepositoryImpl extends MongoGenericRepository<Authorization> implements AuthorizationRepository {
  constructor(db: Db) {
    super(db, authorizationModel);
  }

  findOneByResourceIdAndResourceTypeAndUserId(resourceId: string, resourceType: ResourceType, userId: string): Observable<Authorization> {
    const query = {resourceId, resourceType, userId};
    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(obj => MongoUtil.map(obj, this.getIdName())));
  }

  findByResourceTypeAndUserId(resourceType: ResourceType, userId: string): Observable<Authorization[]> {
    const query = {userId, resourceType};
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, this.getIdName())));
  }

  findByResourceIdAndResourceType(resourceId: string, resourceType: ResourceType): Observable<Authorization[]> {
    const query = {resourceId, resourceType};
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, this.getIdName())));
  }

  deleteOneByResourceIdAndResourceTypeAndUserIdAndRoleId(resourceId: string, resourceType: ResourceType, userId: string, roleId: string): Observable<boolean> {
    const query = {resourceId, resourceType, userId, roleId};
    return MongoUtil.rxDeleteOne(this.getCollection(), query).pipe(map(value => value === 1));
  }

}
