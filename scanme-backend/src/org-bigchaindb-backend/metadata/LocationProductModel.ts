import { DataType, Model } from '../../core';

export const location_productsModel: Model = {
    name: 'location_products',
    sourceName: 'location_products',
    attributes: {
        locationProductId: {
            type: DataType.String,
            primaryKey: true
        },
        productId: {
            type: DataType.String
        },
        scanLocation: {
            type: DataType.Array
        },
        scanDate: {
            type: DataType.DateTime
        },
        itemId: {
            type: DataType.String
        },
        transactionId: {
            type: DataType.String
        }
    }
};
