import {Observable} from 'rxjs';
import {SigninInfo} from '../model/SigninInfo';
import {SigninResult} from '../model/SigninResult';

export interface AuthenticationService {
  authenticate(user: SigninInfo): Observable<SigninResult>;
}
