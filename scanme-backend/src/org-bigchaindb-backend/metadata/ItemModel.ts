import { DataType, Model } from '../../core';

export const itemModel: Model = {
    name: 'item',
    sourceName: 'item',
    attributes: {
        itemId: {
            type: DataType.String,
            primaryKey: true
        },
        mfg: {
            type: DataType.String
        },
        exp: {
            type: DataType.String
        },
        lot: {
            type: DataType.String
        },
        productCatId: {
            type: DataType.String
        },
        point: {
            type: DataType.Number
        },
        actionCode: {
            type: DataType.Number
        },
        transactionId: {
            type: DataType.String
        }
    }
};
