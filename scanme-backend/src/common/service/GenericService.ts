import {Observable} from 'rxjs';
import {ErrorMessage} from '../model/ErrorMessage';
import {ResultInfo} from '../model/ResultInfo';
import {ViewService} from './ViewService';

export interface GenericService<T> extends ViewService<T> {
  validateObject(obj: T): Observable<ErrorMessage[]>;
  insert(obj: T): Observable<ResultInfo<T>>;
  update(obj: T): Observable<ResultInfo<T>>;
  save(obj: T): Observable<ResultInfo<T>>;
  delete(id): Observable<ResultInfo<T>>;
  // deleteByIds(obj: T): Observable<ResultInfo<T>>;
  deleteByIds(ids: any): Observable<number>;
  deleteTransaction?(id): Observable<ResultInfo<T>>;
}
