import { Observable } from 'rxjs';
import { SigninInfo } from '../../common/authentication/model/SigninInfo';
import { UserInfo } from '../../common/authentication/model/UserInfo';

export interface UserInfoService {
  getUserInfo(auth: SigninInfo): Observable<any>;
  passAuthentication(userInfo: UserInfo): Observable<boolean>;
  handleWrongPassword(userInfo: UserInfo): Observable<boolean>;
  deactivateUser(actionByUserId: string, userId: string): Observable<boolean>;
}
