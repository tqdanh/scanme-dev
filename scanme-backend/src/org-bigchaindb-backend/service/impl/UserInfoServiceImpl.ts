import {Observable, of, zip} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {DefaultUserInfo} from '../../../common/authentication/model/DefaultUserInfo';
import {SigninInfo} from '../../../common/authentication/model/SigninInfo';
import {UserInfo} from '../../../common/authentication/model/UserInfo';
import {UserStatus} from '../../../common/authentication/model/UserStatus';
import {DateUtil} from '../../../core';
import {Authentication, User} from '../../../shared/user-model';
import {AuthenticationRepository, UserRepository} from '../../../shared/user-repository';
import {OrganizationRepository} from '../../repository/OrganizationRepository';
import {UserInfoService} from '../UserInfoService';

export class UserInfoServiceImpl implements UserInfoService {
  constructor(private userRepository: UserRepository, private organizationRepository: OrganizationRepository, private authenticationRepository: AuthenticationRepository, private maxPasswordFailed: number, private lockedHours: number) {
  }

  getUserInfo(info: SigninInfo): Observable<UserInfo> {
    return this.userRepository.findByUserName(info.userName).pipe(flatMap(user => {
      if (!user) {
        return of(null);
      }
      return this.authenticationRepository.getById(user.userId).pipe(map(auth => {
        const userInfo = new DefaultUserInfo();
        userInfo.userId = user.userId;
        userInfo.userName = user.userName;
        userInfo.email = user.email;
        userInfo.organizationId = user.organizationId;
        userInfo.disable = user.disable;
        userInfo.maxPasswordAge = user.maxPasswordAge;
        userInfo.displayName = user.displayName;
        userInfo.suspended = (user.status === UserStatus.Suspended);
        userInfo.deactivated = (user.status === UserStatus.Deactivated);
        if (!!auth) {
          userInfo.password = auth.password;
          userInfo.lockedUntilTime = auth.lockedUntilTime;
          userInfo.successTime = auth.successTime;
          userInfo.failTime = auth.failTime;
          userInfo.failCount = auth.failCount;
          userInfo.passwordModifiedTime = auth.passwordModifiedTime;
        }
        return userInfo;
      }));
    }));
  }

  passAuthentication(userInfo: UserInfo): Observable<boolean> {
    const auth = new Authentication();
    auth.userId = userInfo.userId;
    auth.successTime = DateUtil.now();
    auth.failCount = 0;
    auth.lockedUntilTime = null;
    const authObservable = this.authenticationRepository.patch(auth).pipe(map(item => {
      return !!item;
    }));
    if (userInfo.deactivated === false) {
      return authObservable;
    } else {
      const user = new User();
      user.userId = userInfo.userId;
      user.status = UserStatus.Activated;
      const userObservable = this.userRepository.patch(user).pipe(map(obj => {
        return !!obj;
      }));
      return zip(userObservable, authObservable, (userSuccess, authSuccess) => {
        return userSuccess && authSuccess;
      });
    }
  }

  handleWrongPassword(userInfo: UserInfo): Observable<boolean> {
    const auth = new Authentication();
    auth.userId = userInfo.userId;
    auth.failTime = DateUtil.now();
    if (this.maxPasswordFailed > 0 && auth.failCount >= this.maxPasswordFailed) {
      auth.lockedUntilTime = DateUtil.addHours(DateUtil.now(), this.lockedHours);
      auth.failCount = 0;
    } else {
      auth.failCount = auth.failCount + 1;
    }
    return this.authenticationRepository.patch(auth).pipe(map(item => {
      return !!item;
    }));
  }

  deactivateUser(actionByUserId: string, userId: string): Observable<boolean> {
    return this.userRepository.getById(userId).pipe(flatMap(userAdmin => {
      const roles = userAdmin.roles;
      if (roles.includes('admin')) {
        return this.userRepository.getById(userId).pipe(flatMap(user => {
          if (user && (userAdmin.organizationId === user.organizationId)) {
            user.status = UserStatus.Deactivated;
            return this.userRepository.update(user).pipe(flatMap(() => {
              return of (true);
            }));
          } else {
            return of (false);
          }
        }));
      }
    }));
  }
}
