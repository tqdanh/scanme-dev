import {Observable, of} from 'rxjs';
import config from '../../../config';
import {SigninInfo} from '../../model/SigninInfo';
import {SigninResult} from '../../model/SigninResult';
import {AuthenticationService} from '../AuthenticationService';
import {WebClientUtil} from '../../../common/util/WebClientUtil';
// import MockAccInfo from './user-info-mock.json';
export class AuthenticationServiceImpl implements AuthenticationService {
  authenticate(user: SigninInfo): Observable<SigninResult> {
    const url = config.authenticationServiceUrl + '/authenticate';
    // return of(JSON.parse(JSON.stringify(MockAccInfo)));
    return WebClientUtil.putObject<SigninResult>(url, user);
  }
}
