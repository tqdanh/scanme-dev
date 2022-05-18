import {RedisClient} from 'redis';
import {fromEvent, Observable, of} from 'rxjs';
import {RedisUtil} from '../../util/RedisUtil';
import {RxCacheManager} from '../RxCacheManager';

export class RedisCacheManager implements RxCacheManager<string, string> {
  private enabled: boolean;
  constructor(private redisClient: RedisClient, private expires = 0) {
    this.enabled = redisClient.connected;

    fromEvent(redisClient, 'end').subscribe(() => {
      console.log('RedisCacheManager will not be working because the connection has closed.');
      this.enabled = false;
    });

    fromEvent(redisClient, 'ready').subscribe(() => {
      console.log('RedisCacheManager will be working now because the connection is established.');
      this.enabled = true;
    });
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  put(key: string, value: string, expiresInMilliseconds?: number): Observable<boolean> {
    if (!this.isEnabled()) {
      return of(false);
    }

    if (!expiresInMilliseconds || expiresInMilliseconds < 0) {
      return RedisUtil.set(this.redisClient, key, value, this.expires);
    } else {
      return RedisUtil.set(this.redisClient, key, value, expiresInMilliseconds);
    }
  }

  get(key: string): Observable<string> {
    if (this.isEnabled()) {
      return RedisUtil.get(this.redisClient, key);
    } else {
      return of(null);
    }
  }

  getMany(keys: string[]): Observable<string[]> {
    if (this.isEnabled()) {
      return RedisUtil.getMany(this.redisClient, keys);
    } else {
      const res = Array.apply(null, new Array(keys.length));
      return of(res);
    }
  }

  containsKey(key: string): Observable<boolean> {
    return RedisUtil.exists(this.redisClient, key);
  }

  remove(key: string): Observable<boolean> {
    return RedisUtil.delete(this.redisClient, key);
  }

  clear(): Observable<boolean> {
    return RedisUtil.clear(this.redisClient);
  }
}
