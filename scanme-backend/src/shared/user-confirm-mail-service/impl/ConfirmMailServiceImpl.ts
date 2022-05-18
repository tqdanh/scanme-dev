import * as bcrypt from 'bcrypt';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Organization} from '../../../org-bigchaindb-backend/model/Organization';

import {BcryptUtil} from '../../../common/util/BcryptUtil';
import {DateUtil, MailService} from '../../../core';
import {UserRegistrationCode} from '../../../org-bigchaindb-backend/repository/UserRegistrationCode';
import {UserRegistrationCodeRepository} from '../../../org-bigchaindb-backend/repository/UserRegistrationCodeRepository';
import {User} from '../../user-model';
import {ConfirmMailService} from '../ConfirmMailService';

export class ConfirmMailServiceImpl implements ConfirmMailService {
  constructor(
    private userRegistrationCodeRepository: UserRegistrationCodeRepository,
    private mailService: MailService,
    private fromEmail: string,
    private domain: string,
    private httpPort: number,
    private httpsSecure: boolean,
    private passcodeConfirmUserExpires: number
  ) {
  }

  send(user: User, org?: Organization): Observable<boolean> {
    return this.createConfirmCode(user, org);
  }

  private createConfirmCode(user: User, org?: Organization): Observable<boolean> {
    const codeSendToEmail = BcryptUtil.getRandomString(6);
     return BcryptUtil.generateHashCode(bcrypt, codeSendToEmail).pipe(flatMap(passcode => {
      const userRegistrationCode = new UserRegistrationCode();
      userRegistrationCode.userId = user.userId;
      userRegistrationCode.passcode = passcode;
      userRegistrationCode.expiredDateTime = DateUtil.addSeconds(DateUtil.now(), this.passcodeConfirmUserExpires);

      return this.userRegistrationCodeRepository.save(userRegistrationCode).pipe(flatMap(() => {
        return this.sendConfirmMail(user.email, user.userId, codeSendToEmail, org);
      }));
     }));
  }

  private sendConfirmMail(toEmail: string, userId: string, passcode: string, org?: Organization): Observable<boolean> {
    const confirmUrl = this.buildConfirmUrl(userId, passcode, org);
    const expired = this.passcodeConfirmUserExpires / 3600;
    const msg = {
      to: toEmail,
      from: this.fromEmail,
      subject: 'User registration confirmation',
      html: `Please click this link to confirm to activate your account:<br>
<a href="${confirmUrl}">Confirm Now</a><br><br>

If the above button doesn't work for you, please click on the below link or copy paste it on to your browser<br>
<a href="${confirmUrl}">${confirmUrl}</a><br><br>
Your link will expire after ${expired} hours.`
    };

    return this.mailService.sendMail(msg).pipe(map(() => {
      return true;
    }));
  }

  private buildConfirmUrl(userId: string, passcode: string, org?: Organization) {
    const port = this.httpPort === 80 || this.httpPort === 443 ? '' : ':' + this.httpPort;
    if (org) {
        return `${this.httpsSecure ? 'https' : 'http'}://${this.domain}${port}/org-registration/confirm/${userId}/${passcode}`;
    } else {
        return `${this.httpsSecure ? 'https' : 'http'}://${this.domain}${port}/user-registration/confirm/${userId}/${passcode}`;
    }
  }
}
