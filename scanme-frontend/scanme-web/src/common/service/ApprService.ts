import {Observable} from 'rxjs';
import {ResultModel} from '../model/ResultModel';

export interface ApprService<T> {
  approve?(model: any, callback?: any): Observable<ResultModel>;
  reject?(model: any, callback?: any): Observable<ResultModel>;
}
