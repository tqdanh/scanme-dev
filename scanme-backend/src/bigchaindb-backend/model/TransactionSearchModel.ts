import {SearchModel} from '../../common/model/SearchModel';

export class TransactionSearchModel implements SearchModel {
    keyword: string;
    sortField: string;
    sortType: string;
    pageIndex: number;
    pageSize: number;
    initPageSize: number;
    publicKey: string;
    productLine: string;
    productDescription: string;
    providerName: string;
    spentStatus: boolean;
    transactionId: string;
    assetId: string;
    amount: string;
    timeStamp: string;
}
