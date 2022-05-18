import {DataType, Model} from '../../../core';

export const identityModel: Model = {
  name: 'identity',
  attributes: {
    identityId: {
      type: DataType.String,
      primaryKey: true
    },
    privateKey: {
      type: DataType.String,
      length: 255,
      nullable: true
    },
    publicKey: {
      type: DataType.String,
      length: 255,
      nullable: false
    }
  }
};
