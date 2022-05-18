import { DataType, Model } from '../../core';

export const organizationModel: Model = {
    name: 'organization',
    sourceName: 'organization',
    attributes: {
        organizationId: {
            type: DataType.String,
            primaryKey: true
        },
        organizationName: {
            type: DataType.String
        },
        organizationType: {
            type: DataType.String
        },
        organizationAddress: {
            type: DataType.String
        },
        location: {
            type: DataType.Array
        },
        organizationPhone: {
            type: DataType.String
        },
        email: {
            type: DataType.String
        },
        identityId: {
            type: DataType.String
        },
        description: {
            type: DataType.String
        },
        certificate: {
            type: DataType.String
        },
        imageUrl: {
            type: DataType.String
        },
        promotionDescriptions: {
            type: DataType.Array
        },
        adsDescriptions: {
            type: DataType.Array
        }
    }
};
