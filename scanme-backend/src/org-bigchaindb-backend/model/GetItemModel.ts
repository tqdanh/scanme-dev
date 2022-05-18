import {SearchModel} from '../../common/model/SearchModel';

export class GetItemModel implements SearchModel {
    constructor() {
    }

    _id: string;
    mfg: string;
    exp: string;
    lot: string;
    actionCode: number;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
