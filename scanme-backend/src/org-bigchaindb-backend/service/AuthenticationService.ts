import { Observable } from 'rxjs';
import { SigninInfo } from '../../common/authentication/model/SigninInfo';
import { SigninResult } from '../../common/authentication/model/SigninResult';

export interface AuthenticationService {
  authenticate(signinInfo: SigninInfo): Observable<SigninResult>;
}
