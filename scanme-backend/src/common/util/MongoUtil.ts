import {
  BulkWriteOpResultObject,
  Collection, Db,
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
  InsertOneWriteOpResult,
  InsertWriteOpResult, MongoClient
} from 'mongodb';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';
import {StringUtil} from './StringUtil';

export class MongoUtil {
  public static createConnection(uri: string, dbName: string, authSource = 'admin', poolSize = 5): Promise<Db> {
    return new Promise<Db>((resolve, reject) => {
      MongoClient.connect(uri, {useNewUrlParser: true, authSource, poolSize}, (err, client: MongoClient) => {
        if (err) {
          reject(err);
        } else {
          const db: Db = client.db(dbName);
          resolve(db);
        }
      });
    });
  }

  public static map(obj: any, idName: string): any {
    if (!obj) {
      return obj;
    }
    if (!StringUtil.isEmpty(idName)) {
      obj[idName] = obj['_id'];
    }
    delete obj['_id'];
    return obj;
  }

  public static mapArray(objs: any, idName: string): any {
    if (!objs) {
      return objs;
    }
    for (let i = 0; i < objs.length; i++) {
      MongoUtil.map(objs[i], idName);
    }
    return objs;
  }

  public static rxFindOneAndMapId<T>(collection: Collection, query: any, idName: string): Observable<T> {
    return MongoUtil.rxFindOne(collection, query).pipe(map(obj => {
      return MongoUtil.map(obj, idName);
    }));
  }

  public static rxFindOne<T>(collection: Collection, query: any): Observable<T> {
    return fromPromise(new Promise<T>((resolve, reject) => {
      collection
        .findOne(query, (err, item: T) => {
          if (err) {
            return reject(err);
          }
          return resolve(item);
        });
    }));
  }

  public static rxFindOneWithFields<T>(collection: Collection, query: any, fields: any): Observable<T> {
    return fromPromise(new Promise<any>(((resolve, reject) => {
      collection
        .findOne(query, {projection: fields}, (err, item: T) => {
          if (err) {
            return reject(err);
          }
          return resolve(item);
        });
    })));
  }

  public static rxFindAndMapId<T>(collection: Collection, query: any, idName?: string, sort?: any, limit?: number, skip?: number, project?: any): Observable<Array<T>> {
    return MongoUtil.rxFind<T>(collection, query, sort, limit, skip, project).pipe(map(objects => {
      return MongoUtil.mapArray(objects, idName);
    }));
  }

  public static rxFind<T>(collection: Collection, query: any, sort?: any, limit?: number, skip?: number, project?: any): Observable<Array<T>> {
    return fromPromise(new Promise<Array<T>>((resolve, reject) => {
      let findMethod = collection.find(query);
      if (sort) {
        findMethod = findMethod.sort(sort);
      }
      if (limit) {
        findMethod = findMethod.limit(limit);
      }
      if (skip) {
        findMethod = findMethod.skip(skip);
      }
      if (project) {
        findMethod = findMethod.project(project);
      }

      findMethod.toArray((err, items: Array<T>) => {
        if (err) {
          return reject(err);
        }
        return resolve(items);
      });
    }));
  }

  public static rxInsert<T>(collection: Collection, object: any): Observable<T> {
    return fromPromise(new Promise<T>(((resolve, reject) => {
      collection.insertOne(object, (err, result: InsertOneWriteOpResult) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.ops[0]);
      });
    })));
  }

  public static rxInsertObjects<T>(collection: Collection, objects: Array<T>): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      collection.insertMany(objects, (err, result: InsertWriteOpResult) => err ? reject(err) : resolve(result.insertedCount));
    })));
  }

  public static rxPatch<T>(collection: Collection, object: any): Observable<T> {
    return fromPromise(new Promise<T>(((resolve, reject) => {
      if (!object['_id']) {
        return reject(new Error('Cannot updateOne an Object that do not have _id field.'));
      }
      collection.findOneAndUpdate({_id: object['_id']}, {$set: object}, {returnOriginal: false}, (err, result: FindAndModifyWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.value);
      });
    })));
  }


  public static rxUpdate<T>(collection: Collection, object: any): Observable<T> {
    return fromPromise(new Promise<T>(((resolve, reject) => {
      if (!object['_id']) {
        return reject(new Error('Cannot updateOne an Object that do not have _id field.'));
      }
      collection.findOneAndReplace({_id: object['_id']}, object, {returnOriginal: false}, (err, result: FindAndModifyWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.value);
      });
    })));
  }

  public static rxUpdateObjects<T>(collection: Collection, objects: Array<T>): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      const operations = [];
      for (const object of objects) {
        if (object['_id']) {
          operations.push({
            updateOne: {
              filter: {_id: object['_id']},
              update: {$set: object}
            }
          });
        }
      }

      if (operations.length === 0) {
        return resolve(0);
      }

      collection.bulkWrite(operations, (err, result: BulkWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.modifiedCount);
      });
    })));
  }

  public static rxUpdateFieldArray<T>(collection: Collection, object: any, arr: any): Observable<T> {
    return fromPromise(new Promise<T>(((resolve, reject) => {
      if (!object['_id']) {
        return reject(new Error('Cannot updateOne an Object that do not have _id field.'));
      }
      collection.findOneAndUpdate({_id: object['_id']}, {$push: arr}, {returnOriginal: false}, (err, result: FindAndModifyWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.value);
      });
    })));
  }

  public static rxUpdateObjectByQuery<T>(collection: Collection, query: any, update: any): Observable<T> {
    return fromPromise(new Promise<T>(((resolve, reject) => {
      collection.findOneAndUpdate(query, {$set: update}, {returnOriginal: false}, (err, result: FindAndModifyWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.value);
      });
    })));
  }

  public static rxUpsert<T>(collection: Collection, object: any): Observable<T> {
    if (object['_id']) {
      return fromPromise(new Promise<T>(((resolve, reject) => {
        collection.findOneAndUpdate({_id: object['_id']}, {$set: object}, {
          upsert: true,
          returnOriginal: false
        }, (err, result: FindAndModifyWriteOpResultObject) => {
          if (err) {
            return reject(err);
          }
          return resolve(result.value);
        });
      })));
    } else {
      return this.rxInsert(collection, object);
    }
  }

  public static rxUpsertObjects<T>(collection: Collection, objects: Array<T>): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      const operations = [];
      for (const object of objects) {
        if (object['_id']) {
          operations.push({
            updateOne: {
              filter: {_id: object['_id']},
              update: {$set: object},
              upsert: true
            }
          });
        } else {
          operations.push({
            insertOne: {
              document: object
            }
          });
        }
      }

      collection.bulkWrite(operations, (err, result: BulkWriteOpResultObject) => {
        if (err) {
          return reject(err);
        }
        return resolve(result.insertedCount + result.modifiedCount + result.upsertedCount);
      });
    })));
  }

  public static rxDelete(collection: Collection, query: any): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      collection
        .deleteOne(query, function (err, result: DeleteWriteOpResultObject) {
          if (err) {
            return reject(err);
          }
          return resolve(result.deletedCount);
        });
    })));
  }

  public static rxDeleteOne(collection: Collection, query: any): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      collection
          .deleteOne(query, function (err, result: DeleteWriteOpResultObject) {
            if (err) {
              return reject(err);
            }
            return resolve(result.deletedCount);
          });
    })));
  }

  public static rxDeleteObjects(collection: Collection, query: any): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      collection
        .deleteMany(query, function (err, result: DeleteWriteOpResultObject) {
          if (err) {
            return reject(err);
          }
          return resolve(result.deletedCount);
        });
    })));
  }

  public static rxDeleteById(collection: Collection, _id: any): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      if (!_id) {
        return resolve(0);
      }
      collection.deleteOne({_id}, (err, result: DeleteWriteOpResultObject) => err ? reject(err) : resolve(result.deletedCount));
    })));
  }

  public static rxDeleteByIds(collection: Collection, _ids: Array<any>): Observable<number> {
    return fromPromise(new Promise<number>(((resolve, reject) => {
      if (!_ids || _ids.length === 0) {
        return resolve(0);
      }

      const operations = [];
      for (const _id of _ids) {
        operations.push({
          deleteOne: {
            filter: {_id}
          }
        });
      }

      collection.bulkWrite(operations, (err, result: BulkWriteOpResultObject) => err ? reject(err) : resolve(result.deletedCount));
    })));
  }

  public static rxCount(collection: Collection, query: any): Observable<number> {
    return fromPromise(new Promise<number>((resolve, reject) => {
      collection.countDocuments(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }));
  }

  public static rxFindWithAggregate<T>(collection: Collection, query: any): Observable<Array<T>> {
    return fromPromise(new Promise<Array<T>>(((resolve, reject) => {
      collection.aggregate(query, (error, result: any) => {
        result.toArray(function (err, items) {
          if (err) {
            return reject(err);
          }
          return resolve(items);
        });
      });
    })));
  }
}
