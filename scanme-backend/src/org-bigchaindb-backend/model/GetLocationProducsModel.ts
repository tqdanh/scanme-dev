import {SearchModel} from '../../common/model/SearchModel';

export class GetLocationProducsModel implements SearchModel {
    constructor() {
    }

    orgId: string;
    fromDate: Date;
    endDdate: Date;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
