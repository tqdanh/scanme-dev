export class Info {
  actionType?: string;
  appKeyword?: string;
  appLogo?: string;
  consentDate?: string;
  consentFlag?: string;
  consentUxDate?: string;
  deepLinkUrl?: string;
  detail?: object;
  displayName?: string;
  formURL?: string;
  isCancelToken?: string;
  nextAction?: string;
  partnerId?: string;
  rgb?: string;
  subDisplayName?: string;
  contactInfo?: string;
  timerCount?: string;
  body?: Body;
}

export class Body {
  msgTitle: string;
  leadId: string;
  accountNo: string;
  identNo: string;
  firstnameTh: string;
  lastnameTh: string;
  dob: string;
  loanAmtMax: string;
  loanAmtMin: string;
  riskScore: string;
  selfDeclare: string;
}

export interface BaseInitModel {
  mobileNo?: string;
  mobileOS?: string;
  appVersion?: string;
  appId?: string;
  inboxSessionId?: string;
  language?: string;
  corrId?: string;
}

export interface InitModel extends BaseInitModel {
  os?: string;
  osVersion?: string;
  email?: string;
  feedId?: string;
  formId?: string;
  tokenId?: string;
  info?: Info;
  uuid?: string;
}
