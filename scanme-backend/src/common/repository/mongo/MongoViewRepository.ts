import {ObjectId} from 'bson';
import {Db} from 'mongodb';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {DataType} from '../../DataType';
import {Attribute} from '../../metadata/Attribute';
import {Model} from '../../metadata/Model';
import {MetadataUtil} from '../../metadata/util/MetadataUtil';
import {MongoUtil} from '../../util/MongoUtil';
import {ViewRepository} from '../ViewRepository';
import {BaseMongoRepository} from './BaseMongoRepository';

export class MongoViewRepository<T> extends BaseMongoRepository implements ViewRepository<T> {
  private collectionName: string;
  protected idName: string;
  protected idObjectId: Boolean = false;

  constructor(db: Db, protected model: Model) {
    super(db);
  }

  protected getCollectionName(): string {
    if (!this.collectionName) {
      this.collectionName = (!this.model.sourceName ? this.model.name : this.model.sourceName);
    }
    return this.collectionName;
  }

  protected getCollection() {
    return this.db.collection(this.getCollectionName());
  }

  protected getIdName(): string {
    if (!this.idName) {
      const attributes = this.model.attributes;
      const keys = Object.keys(attributes);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const attribute: Attribute = attributes[key];
        if (attribute.primaryKey === true) {
          this.idName = key;
          if (attribute.type === DataType.ObjectId) {
            this.idObjectId = true;
          }
          break;
        }
      }
    }
    return this.idName;
  }

  getMetaData(): Model {
    return this.model;
  }

  getAll(): Observable<T[]> {
    const metadata = MetadataUtil.getMetaModel(this.getMetaData());
    const idName = this.getIdName();
    return MongoUtil.rxFind(this.getCollection(), {}).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
  }

  getById(id): Observable<T> {
    const metadata = MetadataUtil.getMetaModel(this.getMetaData());
    const idName = this.getIdName();
    const query = {'_id': (this.idObjectId ? new ObjectId(id) : '' + id)};
    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(obj => MongoUtil.map(obj, idName)));
  }

  exists(id): Observable<boolean> {
    const idName = this.getIdName();
    const query = {'_id': (this.idObjectId ? new ObjectId(id) : '' + id)};
    return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(obj => {
      return (!obj ? false : true);
    }));
  }

  getByObject(query): Observable<T[]> {
    const metadata = MetadataUtil.getMetaModel(this.getMetaData());
    const idName = this.getIdName();
    return MongoUtil.rxFind(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
  }

  getByOneObject(obj): Observable<T> {
    return undefined;
  }
}
