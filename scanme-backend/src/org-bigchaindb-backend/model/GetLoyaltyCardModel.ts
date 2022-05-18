import {SearchModel} from '../../common/model/SearchModel';

export class GetLoyaltyCardModel implements SearchModel {
    constructor() {
    }

    _id: string;
    cardNumber: string;
    ownerId: string;
    orgId: string;
    type: number;
    point: number;
    items: object;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
