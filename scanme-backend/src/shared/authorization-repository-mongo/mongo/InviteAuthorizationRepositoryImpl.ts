import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {MongoGenericRepository, MongoUtil} from '../../../mongo-core';
import {InviteAuthorization, inviteAuthorizationModel, ResourceType} from '../../authorization-model';
import {InviteAuthorizationRepository} from '../../authorization-repository';

export class InviteAuthorizationRepositoryImpl extends MongoGenericRepository<InviteAuthorization> implements InviteAuthorizationRepository {
  constructor(db: Db) {
    super(db, inviteAuthorizationModel);
  }

  findOneByResourceIdAndResourceTypeAndEmail(resourceId: string, resourceType: ResourceType, email: string): Observable<InviteAuthorization> {
    const query = {resourceId, resourceType, email};
    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(obj => MongoUtil.map(obj, this.getIdName())));
  }

  findByEmail(email: string): Observable<InviteAuthorization[]> {
    const query = {email};
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, this.getIdName())));
  }

  findByResourceIdAndResourceType(resourceId: string, resourceType: ResourceType): Observable<InviteAuthorization[]> {
    const query = {resourceId, resourceType};
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, this.getIdName())));
  }

  deleteOneByResourceIdAndResourceTypeAndEmailAndRoleId(resourceId: string, resourceType: ResourceType, email: string, roleId: string): Observable<boolean> {
    const query = {resourceId, resourceType, email, roleId};
    return MongoUtil.rxDeleteOne(this.getCollection(), query).pipe(map(value => value === 1));
  }

}
