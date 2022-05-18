import {Observable, of} from 'rxjs';

export interface InviteService {
  moveToAuthorization(email: string, userId: string): Observable<number>;
}
