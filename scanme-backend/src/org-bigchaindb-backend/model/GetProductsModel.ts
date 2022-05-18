import {SearchModel} from '../../common/model/SearchModel';

export class GetProductsModel implements SearchModel {
    constructor() {
    }

    _id: string;
    name: string;
    status: number;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
