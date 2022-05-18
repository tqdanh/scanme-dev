import { JwtToken } from './JwtToken';

export interface AuthorizationToken extends JwtToken {
  userId: string;
  userName: string;
  roleType: string;
  email: string;
  providerId: string;
}
