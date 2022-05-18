import {Observable} from 'rxjs';

export interface DataLoader<T> {
  loadData(keyWords: string, max: number): Observable<T[]>;
}
