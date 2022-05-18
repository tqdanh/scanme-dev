import {DataType, Model} from '../../../core';

export const authenticationModel: Model = {
  name: 'authentication',
  attributes: {
    userId: {
      type: DataType.String,
      primaryKey: true
    },
    password: {
      type: DataType.String,
      length: 255
    },
    status: {
      type: DataType.String,
      length: 255
    },
    locked: {
      type: DataType.Bool
    },
    enabled: {
      type: DataType.Bool
    },
    lockedUntilTime: {
      type: DataType.DateTime
    },
    passwordExpiredTime: {
      type: DataType.DateTime
    },
    successTime: {
      type: DataType.DateTime
    },
    failTime: {
      type: DataType.DateTime
    },
    failCount: {
      type: DataType.Number
    },
    passwordModifiedTime: {
      type: DataType.DateTime
    },
    maxPasswordAge: {
      type: DataType.Number
    }
  }
};
