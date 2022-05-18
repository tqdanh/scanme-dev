import {UserStatus} from '../../../common/authentication/model/UserStatus';
import {Achievement} from './Achievement';
import {Appreciation} from './Appreciation';
import {Skill} from './Skill';
import {UserSettings} from './UserSettings';

export class User {
  constructor() {}
  userId: string;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;

  disable: boolean;
  status: UserStatus;
  maxPasswordAge: number; // TODO must move to Authentication model
  userType: string;
  sourceType: string;

  title: string;
  image: string;
  coverImage: string;
  nationality: string;
  alternativeEmail: string;
  phone: string;
  address: string;
  bio: string;
  website: string;
  occupation: string;
  company: string;
  lookingFor: string[];
  remark: string;

  linkedinAccount: string;
  linkedinEmail: string;
  linkedinActive: UserStatus;
  googleAccount: string;
  googleEmail: string;
  googleActive: UserStatus;
  facebookAccount: string;
  facebookEmail: string;
  facebookActive: UserStatus;
  userNameActive: UserStatus;

  twitterLink: string;
  skypeLink: string;
  instagramLink: string;
  linkedinLink: string;
  dribbbleLink: string;
  googleLink: string;
  facebookLink: string;

  customLink01: string;
  customLink02: string;
  customLink03: string;
  customLink04: string;
  customLink05: string;
  customLink06: string;
  customLink07: string;
  customLink08: string;

  settings: UserSettings;
  achievements: Achievement[];
  interests: string[];
  skills: Skill[];
  appreciations: Appreciation[];

  longitude: string;
  latitude: string;
  lastInteractionTime: string;
  availableStatus: string;

  followerCount: number;
  followingCount: number;
  followingSpaceCount: number;

  organizationId: string;
  roles: string[];
}
