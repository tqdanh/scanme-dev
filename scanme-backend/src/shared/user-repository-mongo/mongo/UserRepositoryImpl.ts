import {Db} from 'mongodb';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MongoGenericRepository, MongoUtil} from '../../../mongo-core';
import {User, userModel} from '../../user-model';
import {UserRepository} from '../../user-repository';

export class UserRepositoryImpl extends MongoGenericRepository<User> implements UserRepository {
  constructor(db: Db) {
    super(db, userModel);
  }

  existsUserName(userName: string): Observable<boolean> {
    const fields: any = {id: 1};
    return MongoUtil.rxFindOneWithFields(this.getCollection(), {userName: userName}, fields)
      .pipe(map(obj => {
          return obj ? true : false;
        }
      ));
  }

  existsEmail(str: string): Observable<boolean> {
    const fields: any = {id: 1};
    return MongoUtil.rxFindOneWithFields(this.getCollection(), {userName: str}, fields).pipe(
      map(obj => {
        return obj ? true : false;
        }
      ));
  }

  findByIds(userIds: string[]): Observable<User[]> {
    const idName = this.getIdName();
    const query = {_id: {'$in': userIds}};
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
  }

  findByEmail(email: string): Observable<User> {
    const idName = this.getIdName();
    return MongoUtil.rxFindOne(this.getCollection(), {email: email}).pipe(map(obj => MongoUtil.map(obj, idName)));
  }

  findByUserName(userName: string): Observable<User> {
    const idName = this.getIdName();
    return MongoUtil.rxFindOne(this.getCollection(), {userName: userName}).pipe(map(obj => MongoUtil.map(obj, idName)));
  }

  findByUserNameOrEmail(userName: string): Observable<Array<User>> {
    const idName = this.getIdName();
    const query = {
      $or: [
        {userName: userName},
        {email: userName}
      ]
    };
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
  }

  findOneByUserNameOrEmailOrOAuthEmail(email: string): Observable<User> {
    const idName = this.getIdName();
    const query = {
      $or: [
        {userName: email},
        {email: email},
        {linkedinEmail: email},
        {facebookEmail: email},
        {googleEmail: email},
      ]
    };

    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(obj => MongoUtil.map(obj, idName)));
  }
}
