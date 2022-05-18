import {DataType, Model} from '../../../core';

export const authorizationModel: Model = {
  name: 'authorization',
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
    userId: {
      type: DataType.String
    },
    roleId: {
      type: DataType.String
    }
  }
};
