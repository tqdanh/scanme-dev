import {UserStatus} from '../../common/authentication/model/UserStatus';

export class Organization {
    constructor() {
    }

    public _id: string;
    public organizationId: string;
    public organizationName: string;
    public organizationType: string;
    public organizationAddress: string;
    public location: string [];
    public organizationPhone: string;
    public email: string;
    public identityId: string;
    public status: UserStatus;
    public description: string;
    public certificate: string;
    public imageUrl: string;
    public promotionDescriptions: object[];
    public adsDescriptions: object[];
}
