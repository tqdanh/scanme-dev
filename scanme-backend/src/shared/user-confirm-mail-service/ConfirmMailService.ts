import {Observable, of} from 'rxjs';
import {Organization} from '../../org-bigchaindb-backend/model/Organization';

import {User} from '../user-model';

export interface ConfirmMailService {
  send(user: User, org?: Organization): Observable<boolean>;
}
