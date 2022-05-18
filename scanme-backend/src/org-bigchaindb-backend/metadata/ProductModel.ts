import { DataType, Model } from '../../core';

export const productsModel: Model = {
    name: 'products',
    sourceName: 'products',
    attributes: {
        productId: {
            type: DataType.String,
            primaryKey: true
        },
        name: {
            type: DataType.String
        },
        status: {
            type: DataType.Number
        },
        imageAds: {
            type: DataType.String
        },
        imageUnit: {
            type: DataType.String
        },
        introduction: {
            type: DataType.String
        },
        introductionDescriptions: {
            type: DataType.Array
        },
        ingredientDescriptions: {
            type: DataType.Array
        },
        organizationId: {
            type: DataType.String
        }
    }
};
