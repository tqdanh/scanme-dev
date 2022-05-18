import {Observable} from 'rxjs';
import {ResultInfo} from '../model/ResultInfo';
import {ViewService} from './ViewService';

export interface GenericService<T> extends ViewService<T> {
  patch?(obj: T, body: object): Observable<ResultInfo<T>>;
  insert?(obj: any): Observable<ResultInfo<T>>;
  update?(obj: any): Observable<ResultInfo<T>>;
  delete?(id: string): Observable<ResultInfo<T>>;
}
