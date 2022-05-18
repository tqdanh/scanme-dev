import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {MailData} from '../..';
import {MailService} from '../MailService';

export class SendGridMailService implements MailService {
  constructor(private sendGrid: any, private apiKey: any) {
    this.sendGrid = sendGrid;
    this.apiKey = apiKey;
  }

  sendMail(mailData: MailData): Observable<boolean> {
    this.sendGrid.setApiKey(this.apiKey);
    return fromPromise(this.sendGrid.send(mailData).then(result => {
      if (result[0].statusCode === 200 || result[0].statusCode === 202) {
        return true;
      }
      return false;
    }, err => {
      return err;
    }));
  }
}
