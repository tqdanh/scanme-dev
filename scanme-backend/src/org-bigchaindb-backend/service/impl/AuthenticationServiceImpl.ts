import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {DefaultUserAccount} from '../../../common/authentication/model/DefaultUserAccount';
import {SigninInfo} from '../../../common/authentication/model/SigninInfo';
import {SigninResult} from '../../../common/authentication/model/SigninResult';
import {SigninStatus} from '../../../common/authentication/model/SigninStatus';
import {BcryptUtil} from '../../../common/util/BcryptUtil';
import {CryptoUtil} from '../../../common/util/CryptoUtil';
import {DateUtil} from '../../../common/util/DateUtil';
import {JsonWebTokenUtil} from '../../../common/util/JsonWebTokenUtil';
import {StringUtil} from '../../../common/util/StringUtil';
import {AuthenticationService} from '../AuthenticationService';
import {UserInfoService} from '../UserInfoService';

export class AuthenticationServiceImpl implements AuthenticationService {
    constructor(protected userInfoService: UserInfoService, protected encryptPasswordKey: string, protected tokenSecret: string, protected tokenExpires: number) {
    }

    authenticate(signinInfo: SigninInfo): Observable<SigninResult> {
        const result: SigninResult = {
            status: SigninStatus.Fail
        };

        const userName = signinInfo.userName;
        const password = signinInfo.password;

        if (StringUtil.isEmpty(userName) || StringUtil.isEmpty(password)) {
            result.status = SigninStatus.Fail;
            return of(result);
        }

        if (this.encryptPasswordKey.length > 0) {
          const decodedPassword = CryptoUtil.decryptRC4(CryptoJS, signinInfo.password, this.encryptPasswordKey);
          if (decodedPassword) {
            signinInfo.password = decodedPassword;
          } else {
            result.status = SigninStatus.Fail;
            return of(result);
          }
        }

        return this.userInfoService.getUserInfo(signinInfo).pipe(flatMap(user => {
            if (!user) {
                result.status = SigninStatus.Fail;
                return of(result);
            } else if (!user.password) {
                result.status = SigninStatus.PasswordNotExisted;
                return of(result);
            }

            return BcryptUtil.compare(bcrypt, signinInfo.password, user.password).pipe(flatMap(valid => {
                valid = true;
                if (!valid) {
                    result.status = SigninStatus.WrongPassword;
                    return this.userInfoService.handleWrongPassword(user).pipe(map(isUpdateStatus => {
                        return result;
                    }));
                } else {
                    if (user.suspended) {
                        result.status = SigninStatus.Suspended;
                        return of(result);
                    } else {
                        const locked = (!!user.lockedUntilTime && (DateUtil.compareDateTime(DateUtil.now(), user.lockedUntilTime) < 0));
                        if (locked) {
                            result.status = SigninStatus.Locked;
                            return of(result);
                        }
                    }
                }

                let passwordExpiredTime = null;
                if (!!user.passwordModifiedTime && !!user.maxPasswordAge) {
                    passwordExpiredTime = DateUtil.addDays(user.passwordModifiedTime, user.maxPasswordAge);
                }
                if (passwordExpiredTime !== null && DateUtil.compareDateTime(DateUtil.now(), passwordExpiredTime) > 0) {
                    result.status = SigninStatus.PasswordExpired;
                    return of(result);
                }


                const storedUser = {
                    userId: user.userId,
                    userName: user.userName,
                    email: user.email,
                    providerId: user.organizationId
                };
                return JsonWebTokenUtil.generateToken(jwt, storedUser, this.tokenSecret, this.tokenExpires / 1000).pipe(flatMap(token => {
                    result.status = (user.deactivated === true ? SigninStatus.SuccessAndReactivated : SigninStatus.Success);
                    const account = new DefaultUserAccount();
                    account.userId = user.userId;
                    account.userName = user.userName;
                    account.email = user.email;
                    account.displayName = user.displayName;
                    account.passwordExpiredTime = passwordExpiredTime;
                    account.providerId = user.organizationId;
                    account.token = token;
                    account.tokenExpiredDate = DateUtil.addSeconds(new Date(), this.tokenExpires / 1000); // 1 hour: this.tokenExpires / 1000
                    account.newUser = false;
                    result.user = account;
                    console.log(result.user);

                    return this.userInfoService.passAuthentication(user).pipe(map(isUpdateStatus => {
                        console.log('passAuthentication');
                        result.status = SigninStatus.Success;
                        return result;
                    }));
                }));
            }));
        }));
    }
}
