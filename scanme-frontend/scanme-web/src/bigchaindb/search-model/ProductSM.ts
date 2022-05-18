import {SearchModel} from '../../common/model/SearchModel';

export interface ProductSM extends SearchModel {
    name: string;
    _id: string;
    status: string;
    orgId: string;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
