import {Observable} from 'rxjs';
import {ViewRepository} from './ViewRepository';

export interface GenericRepository<T> extends ViewRepository<T> {
  insert(obj: T): Observable<T>;
  update(obj: T): Observable<T>;
  patch(obj: T): Observable<T>;
  save(obj: T): Observable<T>;
  delete(id): Observable<number>;
  insertObjects(array: T[]): Observable<number>;
  updateObjects(array: T[]): Observable<number>;
  saveObjects(array: T[]): Observable<number>;
  deleteByIds(ids: any): Observable<number>;
}
