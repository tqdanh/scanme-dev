import { DataType, Model } from '../../core';

export const loyaltyCardModel: Model = {
    name: 'loyalty_card',
    sourceName: 'loyalty_card',
    attributes: {
        loyaltyCardId: {
            type: DataType.String,
            primaryKey: true
        },
        cardNumber: {
            type: DataType.String
        },
        ownerId: {
            type: DataType.String
        },
        orgId: {
            type: DataType.String
        },
        type: {
            type: DataType.Number
        },
        point: {
            type: DataType.Number
        },
        items: {
            type: DataType.Array
        }
    }
};
