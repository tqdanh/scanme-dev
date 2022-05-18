import { DataType, Model } from '../../core';

export const consumerModel: Model = {
    name: 'consumer',
    sourceName: 'consumer',
    attributes: {
        consumerId: {
            type: DataType.String,
            primaryKey: true
        },
        fullName: {
            type: DataType.String
        },
        telephone: {
            type: DataType.String
        },
        idCard: {
            type: DataType.String
        },
        sex: {
            type: DataType.String
        },
        birthDay: {
            type: DataType.String
        },
        address: {
            type: DataType.String
        },
        email: {
            type: DataType.String
        },
        userId: {
            type: DataType.String
        },
        sso: {
            type: DataType.String
        }
    }
};
