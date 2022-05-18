import {SearchModel} from '../../common/model/SearchModel';

export class GetGiftModel implements SearchModel {
    constructor() {
    }

    _id: string;
    name: string;
    image: string;
    expiryDate: Date;
    quantity: number;
    point: number;
    orgId: string;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
