import {DataType, Model} from '../../../core';

export const skillModel: Model = {
  name: 'skill',
  attributes: {
    skill: {
      type: DataType.String,
      length: 255,
      primaryKey: true
    },
    hirable: {
      type: DataType.Bool
    }
  }
};
