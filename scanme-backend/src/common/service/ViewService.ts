import {Observable} from 'rxjs';
import {Model} from '../metadata/Model';
import {BaseService} from './BaseService';

export interface ViewService<T> extends BaseService {
  getMetaData(): Model;
  getAll(): Observable<T[]>;
  getById(id): Observable<T>;
  exists(id): Observable<boolean>;
}
