import {Observable} from 'rxjs';
import {DiffModel} from '../model/DiffModel';

export interface DiffService<T> {
  checkDiff?(id): Observable<DiffModel<T>>;
}
