import {Observable} from 'rxjs';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {Identity} from '../model/Identity';

export interface IdentityRepository extends GenericRepository<Identity> {
  findByIdentityId(identityId: string): Observable<Identity>;
  findByUserId(userId: string): Observable<Identity>;
}
