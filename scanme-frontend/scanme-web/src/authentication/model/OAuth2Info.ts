import {SigninType} from './SigninType';

export interface OAuth2Info {
  signInType: SigninType;

  code: string;
  redirectUri: string;
  invitationMail?: string;
  isLink?: boolean;
}
