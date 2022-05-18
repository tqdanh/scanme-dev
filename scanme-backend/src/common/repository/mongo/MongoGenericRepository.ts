import {Db, ObjectId} from 'mongodb';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '../../metadata/Model';
import {MongoUtil} from '../../util/MongoUtil';
import {GenericRepository} from '../GenericRepository';
import {MongoViewRepository} from './MongoViewRepository';

export class MongoGenericRepository<T> extends MongoViewRepository<T> implements GenericRepository<T> {
  constructor(db: Db, model: Model) {
    super(db, model);
  }

  insert(object: T): Observable<T> {
    return MongoUtil.rxInsert(this.getCollection(), this.mapToMongoObject(object)).pipe(
      map(objs => MongoUtil.map(objs, this.getIdName())));
  }

  update(object: T): Observable<T> {
    return MongoUtil.rxUpdate(this.getCollection(), this.mapToMongoObject(object)).pipe(
      map(obj => MongoUtil.map(obj, this.getIdName())));
  }

  patch(object: T): Observable<T> {
    return MongoUtil.rxPatch(this.getCollection(), this.mapToMongoObject(object)).pipe(
      map(obj => MongoUtil.map(obj, this.getIdName())));
  }

  save(object: T): Observable<T> {
    return MongoUtil.rxUpsert(this.getCollection(), this.mapToMongoObject(object)).pipe(
      map(obj => MongoUtil.map(obj, this.getIdName())));
  }

  delete(id): Observable<number> {
    return MongoUtil.rxDeleteById(this.getCollection(), this.idObjectId ? new ObjectId(id) : '' + id);
  }

  insertObjects(array: T[]): Observable<number> {
    for (const item of array) {
      this.mapToMongoObject(item);
    }
    return MongoUtil.rxInsertObjects(this.getCollection(), array);
  }

  updateObjects(array: T[]): Observable<number> {
    for (const item of array) {
      this.mapToMongoObject(item);
    }
    return MongoUtil.rxUpdateObjects(this.getCollection(), array);
  }

  saveObjects(array: T[]): Observable<number> {
    array.map(this.mapToMongoObject);
    return MongoUtil.rxUpsertObjects(this.getCollection(), array);
  }

  // deleteByIds(ids: Array<any>): Observable<number> {
  //   const _ids = [];
  //   this.getIdName(); // update idObjectId
  //   for (const id of ids) {
  //     _ids.push(this.idObjectId ? new ObjectId(id) : '' + id);
  //   }
  //   return MongoUtil.rxDeleteByIds(this.getCollection(), _ids);
  // }

  mapToMongoObject(object: T): T {
    const idName = this.getIdName();

    object['_id'] = this.idObjectId ? new ObjectId(object[idName]) : '' + object[idName];

    if (idName !== '_id') {
      delete object[idName];
    }

    return object;
  }

  deleteByIds(ids: any): Observable<number> {
    return MongoUtil.rxDeleteByIds(this.getCollection(), ids);
  }
}
