import {RedisClient} from 'redis';
import {Observable} from 'rxjs';
import ownKeys = Reflect.ownKeys;
import {fromPromise} from 'rxjs/internal-compatibility';

export class RedisUtil {
  public static set(client: RedisClient, key: string, value: string, expiresInMilliseconds = 0): Observable<boolean> {
    return fromPromise(new Promise(((resolve, reject) => {
      if (!expiresInMilliseconds || expiresInMilliseconds < 0) {
        client.set(key, value, (err, result) => err ? reject(err) : resolve(result === 'OK'));
      } else {
        client.set(key, value, 'PX', expiresInMilliseconds, (err, result) => err ? reject(err) : resolve(result === 'OK'));
      }
    })));
  }

  public static get(client: RedisClient, key: string): Observable<string> {
    return fromPromise(new Promise(((resolve, reject) => {
      client.get(key, (err, result) => err ? reject(err) : resolve(result));
    })));
  }

  public static getMany(client: RedisClient, keys: string[]): Observable<string[]> {
    return fromPromise(new Promise(((resolve, reject) => {
      client.mget(keys, (err, result) => err ? reject(err) : resolve(result));
    })));
  }

  public static exists(client: RedisClient, key: string): Observable<boolean> {
    return fromPromise(new Promise(((resolve, reject) => {
      client.exists(key, (err, result) => err ? reject(err) : resolve(result === 1));
    })));
  }

  public static delete(client: RedisClient, key: string): Observable<boolean> {
    return fromPromise(new Promise(((resolve, reject) => {
      client.del(key, (err, result) => err ? reject(err) : resolve(result === 1));
    })));
  }

  public static clear(client: RedisClient): Observable<boolean> {
    return fromPromise(new Promise(((resolve, reject) => {
      client.flushdb((err, result) => err ? reject(err) : resolve(result === 'OK'));
    })));
  }

}
