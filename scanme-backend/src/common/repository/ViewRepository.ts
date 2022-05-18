import {Observable} from 'rxjs';
import {Model} from '../metadata/Model';
import {BaseRepository} from './BaseRepository';

export interface ViewRepository<T> extends BaseRepository {
  getMetaData(): Model;
  getAll(): Observable<T[]>;
  getById(id): Observable<T>;
  getByObject(obj): Observable<T[]>;
  getByOneObject(obj): Observable<T>;
  exists(id): Observable<boolean>;
}
