import {BaseModel} from '../../../core';
import {Permission} from './Permission';

export class Role extends BaseModel {
  roleId: string;
  name: string;
  permissions: Permission[];
}
