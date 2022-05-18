import {Observable} from 'rxjs';
import {Model} from '../metadata/Model';
import {DynamicLayoutService} from './DynamicLayoutService';

export interface ViewService<T> extends DynamicLayoutService<T> {
  getMetaData?(): Model;
  getAll?(): Observable<T[]>;
  getById?(id): Observable<T>;
}
