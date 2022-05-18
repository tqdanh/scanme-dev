import {DataType, Model} from '../../../core';

export const inviteAuthorizationModel: Model = {
  name: 'authorization.invite',
  attributes: {
    id: {
      type: DataType.ObjectId,
      primaryKey: true
    },
    resourceId: {
      type: DataType.String
    },
    resourceType: {
      type: DataType.String
    },
    email: {
      type: DataType.String
    },
    roleId: {
      type: DataType.String
    }
  }
};
