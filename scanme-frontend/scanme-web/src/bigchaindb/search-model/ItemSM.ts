import {SearchModel} from '../../common/model/SearchModel';

export interface ItemSM extends SearchModel {
    _id: string;
    mfg: string;
    exp: string;
    lot: string;
    productCatId: string;
    point: number;
    actionCode: number;
    transactionId: string;
}
