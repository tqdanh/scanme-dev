import {DataType, Model} from '../../core';

export const userRegistrationCodeModel: Model = {
  name: 'userRegistrationCode',
  attributes: {
    userId: {
      type: DataType.String,
      primaryKey: true
    },
    passcode: {
      type: DataType.String,
      length: 255
    },
    expiredDateTime: {
      type: DataType.DateTime
    }
  }
};
