import {DataType, Model} from '../../../core';
import {Permission} from '../../authorization-model/model/Permission';

export const roleModel: Model = {
  name: 'role',
  sourceName: 'role',
  attributes: {
    roleId: {
      type: DataType.String,
      primaryKey: true
    },
    name: {
      type: DataType.String
    },
    permission: {
      type: DataType.Array,
      typeOf: Permission
    }
  }
};
