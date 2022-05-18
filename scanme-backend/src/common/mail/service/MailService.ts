import {Observable} from 'rxjs';
import {MailData} from '../model/MailData';

export interface MailService {
  sendMail(mail: MailData): Observable<boolean>;
}
