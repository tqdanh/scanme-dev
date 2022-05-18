import {Observable} from 'rxjs';
import {BaseService} from './BaseService';

export interface DynamicLayoutService<T> extends BaseService {
  getAllDynamicForm?(obj?: any): Observable<any>;
  getDynamicFormByModelName?(obj?: any): Observable<any>;
  getDynamicFormById?(id): Observable<any>;
  insertDynamicForm?(obj?: any): Observable<any>;
  updateDynamicForm?(obj?: any): Observable<any>;
  deleteDynamicForm?(id): Observable<any>;
}
