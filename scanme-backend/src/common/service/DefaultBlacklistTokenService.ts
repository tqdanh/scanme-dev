import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {RxCacheManager} from '../cache/RxCacheManager';
import {BlacklistTokenService} from './BlacklistTokenService';

export class DefaultBlacklistTokenService implements BlacklistTokenService {
  readonly JOIN_CHAR = '-';

  constructor(private cache: RxCacheManager<string, string>, private tokenExpires: number, private keyPrefix = 'blacklist-token') {
  }

  private generateKey(token: string): string {
    return this.keyPrefix + '::token::' + token;
  }

  private generateKeyForId(id: string): string {
    return this.keyPrefix + '::id::' + id;
  }

  public revoke(token: string, reason: string, expires: Date): Observable<boolean> {
    const key = this.generateKey(token);
    const value = reason ? reason : '';

    if (!expires) {
      return this.cache.put(key, value);
    }

    const expiresInMilliseconds = expires.getTime() - new Date().getTime();
    if (expiresInMilliseconds <= 0) {
      return of(true); // Token already expires, don't need add to cache
    } else {
      return this.cache.put(key, value, expiresInMilliseconds);
    }
  }

  public revokeAllTokens(id: string, reason: string): Observable<boolean> {
    const key = this.generateKeyForId(id);
    const value = reason + this.JOIN_CHAR + new Date().getTime();

    return this.cache.put(key, value, this.tokenExpires);
  }

  public check(id: string, token: string, createAt: Date): Observable<string> {
    const idKey = this.generateKeyForId(id);
    const tokenKey = this.generateKey(token);

    return this.cache.getMany([idKey, tokenKey]).pipe(map(([idValue, tokenValue]) => {
      if (idValue) {
        const index = idValue.lastIndexOf(this.JOIN_CHAR);
        const reason = idValue.substr(0, index);

        const strDate = idValue.substr(index + 1);
        const date = new Date(parseInt(strDate, 10));

        if (date.getTime() > createAt.getTime()) {
          return reason;
        }
      }

      if (tokenValue) {
        return tokenValue;
      }

      return null;
    }));
  }
}
