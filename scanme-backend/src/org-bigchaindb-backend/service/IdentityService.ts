import {Observable} from 'rxjs';
import {Identity} from '../model/Identity';

export interface IdentityService {
  getIdentityKeysByIdentityId(identityId: string): Observable<Identity>;
  getPublicKeyByIdentityId(identityId: string): Observable<string>;
  getPrivateKeyByIdentityId(identityId: string): Observable<string>;

  getIdentityByUserId(userid: string): Observable<Identity>;
  getPublicKeyByUserId(userId: string): Observable<string>;
  getPrivateKeyByUserId(userId: string): Observable<string>;

}
