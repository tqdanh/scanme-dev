import {Observable} from 'rxjs';

export interface RxCacheManager<K, V> {
  isEnabled(): boolean;
  put(key: K, obj: V, expiresInMilliseconds?: number): Observable<boolean>;
  get(key: K): Observable<V>;
  getMany(keys: K[]): Observable<V[]>;
  containsKey(key: K): Observable<boolean>;
  remove(key: K): Observable<boolean>;
  clear(): Observable<boolean>;
}
