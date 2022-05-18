import {Language} from '../Language';

export class RequestHeader {
  mobileNo: string;
  mobileOS: string;
  appVersion: string;
  appId: string;
  inboxSessionId: string;
  requestUniqueId: string;
  token: string;
  language: Language;
  corrId: string;
}
