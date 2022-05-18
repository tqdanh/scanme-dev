import {DataType, Model} from '../../core';

export const supplyChainModel: Model = {
  name: 'supplyChain',
  attributes: {
    transactionId: {
      type: DataType.String,
      primaryKey: true
    },
    assetId: {
      type: DataType.String
    },
    spentStatus: {
      type: DataType.Bool,
      nullable: true
    },
    outputIndex: {
      type: DataType.Number
    },
    metaData: {
      type: DataType.Object,
      length: 50
    },
    currentPublicKey: {
      type: DataType.String,
      length: 255
    },
    creatorPublicKey: {
      type: DataType.String,
      length: 255
    },
    assetData: {
      type: DataType.Object,
      length: 50
    },
    amount: {
      type: DataType.String
    },
  }
};
