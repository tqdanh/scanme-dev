import {Gender} from '../../core';
import {UserRegistration} from './UserRegistration';

export interface OrganizationRegistration extends UserRegistration {
  userName: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  organizationName: string;
  organizationType: string;
  organizationAddress: string;
  organizationPhone: string;
}

// export json = {
//   "userName": "nongsanminhtam",
//   "password": "123456",
//   "email": "nongsanminhtam@email.com";
//   "gender": Gender.Male,
//   "dateOfBirth"?: Date.now(),
//   "organizationName": 'Công ty nông sản an toàn Minh Tâm',
//   "organizationType": "retailer",
//   "organizationAddress": "TM22 Chung cư Moonlight Park View, 36-40 Đường số 7, Bình Tân Thành phố Hồ Chí Minh",
//   "organizationPhone": "0938003879"
// }