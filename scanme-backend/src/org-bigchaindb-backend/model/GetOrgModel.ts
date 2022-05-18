import {SearchModel} from '../../common/model/SearchModel';

export class GetOrgModel implements SearchModel {
    constructor() {
    }

    name: string;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
