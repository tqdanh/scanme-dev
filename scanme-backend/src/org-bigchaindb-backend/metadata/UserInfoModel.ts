import { DataType, Model } from '../../core';

export const userInfoModel: Model = {
  name: 'userInfo',
  attributes: {
    userId: {
      type: DataType.String,
      primaryKey: true
    },
    userName: {
      type: DataType.String
    },
    email: {
      type: DataType.String
    },
    password: {
      type: DataType.String
    },
    displayName: {
      type: DataType.String
    },
    successTime: {
      type: DataType.DateTime
    },
    status: {
      type: DataType.String
    },
    enabled: {
      type: DataType.Bool
    },
    locked: {
      type: DataType.Bool
    },
    lockedUntilTime: {
      type: DataType.DateTime
    },
    passwordExpiredTime: {
      type: DataType.DateTime
    },
    failTime: {
      type: DataType.DateTime
    },
    failCount: {
      type: DataType.Integer
    },
    passwordModifiedTime: {
      type: DataType.DateTime
    },
    maxPasswordAge: {
      type: DataType.Integer
    },
  }
};
