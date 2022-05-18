import {Observable} from 'rxjs';

export interface BlacklistTokenService {
  revoke(token: string, reason: string, expires: Date): Observable<boolean>;
  revokeAllTokens(id: string, reason: string): Observable<boolean>;
  check(id: string, token: string, createAt: Date): Observable<string>;
}
