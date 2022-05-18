import { DataType, Model } from '../../core';

export const giftModel: Model = {
    name: 'gift',
    sourceName: 'gift',
    attributes: {
        giftId: {
            type: DataType.String,
            primaryKey: true
        },
        name: {
            type: DataType.String
        },
        image: {
            type: DataType.String
        },
        expiryDate: {
            type: DataType.DateTime
        },
        quantity: {
            type: DataType.Number
        },
        point: {
            type: DataType.Number
        },
        orgId: {
            type: DataType.String
        }
    }
};
