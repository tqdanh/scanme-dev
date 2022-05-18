import {MetaDataInfo} from 'bigchaindb-backend/model/MetaDataInfo';
import {Result} from 'bigchaindb-backend/model/Result';
import {TransactionData} from 'bigchaindb-backend/model/TransactionData';
import {Identity} from 'org-bigchaindb-backend/model/Identity';
import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {AssetMetaData} from '../model/AssetMetaData';
import {BigChainTransaction} from '../model/BigChainTransaction';
import {BigchainTransactionId} from '../model/BigchainTransactionId';
import {CreateTransactionData} from '../model/CreateTransactionData';
import {DivideContent} from '../model/DivideContent';
import {GetAssetInfo} from '../model/GetAssetInfo';
import {GetHisByTransIdInfo} from '../model/GetHisByTransIdInfo';
import {GetHisResponse} from '../model/GetHisResponse';
import {GetListOuputUnspentOfTx} from '../model/GetListOuputUnspentOfTx';
import {GetListResponse} from '../model/GetListResponse';
import {GetOutputInfoAll} from '../model/GetOutputInfoAll';
import {MiddleWareTransaction} from '../model/MiddleWareTransaction';
import {StatusCode} from '../model/StatusCode';
import {TransactionIdRequest} from '../model/TransactionIdRequest';
import {TransactionSearchModel} from '../model/TransactionSearchModel';

export interface BigChainService {
    // get historical of asset by asset id (Including all transactions with the asset id)
    getHisByAssetId(request: GetAssetInfo): Observable<GetHisResponse[]>;

    // for Web
    // get historical of asset by transaction id (on a branch that backward from this transaction Id)
    getHisAssetByTransId(request: GetHisByTransIdInfo): Observable<GetHisResponse[]>;

    // for Mobile
    traceProduct(transactionId: string): Observable<GetHisResponse[]>;

    // for Mobile: get content of transaction by transactionId
    getTransaction(transactionId: string): Observable<BigChainTransaction>;

    // get list unspent that not is Creator owner
    getSourcesForCreateAsset(request: GetOutputInfoAll): Observable<GetListResponse[]>;

    // get list output unspent and not creator of one transaction (Using for select Sources when creating an asset)
    getListOuputUnspentOfTx(request: GetListOuputUnspentOfTx): Observable<GetListResponse[]>;

    // New Search apply search model and sortfield, sorttype
    // search asset by str search: productLine, productDescription, providerName, spentStatus
    searchAssets(request: TransactionSearchModel): Observable<SearchResult<GetListResponse>>;

    // create asset
    createAsset(identity: Identity, transaction: TransactionData): Observable<Result<TransactionData>>;

    // transfer transaction to other
    transferAsset(transactionIdRequest: TransactionIdRequest, orgId: string, metaData: AssetMetaData): Observable<Result<TransactionData>>;

    // append metadata for one transaction
    appendMetaData(transactionIdRequest: TransactionIdRequest, metaData: MetaDataInfo): Observable<Result<TransactionData>>;

    // burn transaction
    burnAsset(transactionIdRequest: TransactionIdRequest): Observable<Result<TransactionData>>;

    // divide asset
    divideAsset(transactionIdRequest: TransactionIdRequest, divideContent: DivideContent[]): Observable<Result<TransactionData>>;

    // getSearchTxIdByItemId
    getSearchTxIdByItemId(itemIds: string[]): Observable<any>;

    // getSearchItemIdByTxId
    getSearchItemIdByTxId(txIds: string[]): Observable<any>;

    // getSearchTxIdByItemIdInList
    getSearchTxIdByItemIdInList(itemIds: string, listTrans: any): Observable<any>;

    // getTransactionIdsByPublicKey
    getTransactionIdsByPublicKey(publicKey: string, spent?: boolean): Observable<any>;

}
