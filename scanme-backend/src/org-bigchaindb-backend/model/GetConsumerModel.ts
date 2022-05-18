import {SearchModel} from '../../common/model/SearchModel';

export class GetConsumerModel implements SearchModel {
    constructor() {
    }

    _id: string;
    fullName: string;
    telephone: string;
    idCard: string;
    sex: string;
    birthDay: string;
    address: string;
    email: string;
    userId: string;
    sso: string;
    initPageSize: number;
    keyword: string;
    pageIndex: number;
    pageSize: number;
    sortField: string;
    sortType: string;
}
