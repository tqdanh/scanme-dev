import {Bc} from 'bigchaindb-driver';
import * as driver from 'bigchaindb-driver';
import {Identity} from 'org-bigchaindb-backend/model/Identity';
import {Observable, of, zip} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {flatMap, map} from 'rxjs/operators';
import {logger} from '../../../common/logging/logger';
import {SearchResult} from '../../../common/model/SearchResult';
import {JsonUtil} from '../../../common/util/JsonUtil';
import {Organization} from '../../../org-bigchaindb-backend/model/Organization';
import {OrganizationService} from '../../../org-bigchaindb-backend/service/OrganizationService';
import {AssetMetaData} from '../../model/AssetMetaData';
import {BigChainTransaction} from '../../model/BigChainTransaction';
import {BigchainTransactionId} from '../../model/BigchainTransactionId';
import {CreateTransactionData} from '../../model/CreateTransactionData';
import {DivideContent} from '../../model/DivideContent';
import {GetAssetInfo} from '../../model/GetAssetInfo';
import {GetHisByTransIdInfo} from '../../model/GetHisByTransIdInfo';
import {GetHisResponse} from '../../model/GetHisResponse';
import {GetListOuputUnspentOfTx} from '../../model/GetListOuputUnspentOfTx';
import {GetListResponse} from '../../model/GetListResponse';
import {GetOutputInfo} from '../../model/GetOutputInfo';
import {GetOutputInfoAll} from '../../model/GetOutputInfoAll';
import {Result} from '../../model/Result';
import {StatusCode} from '../../model/StatusCode';
import {TransactionData} from '../../model/TransactionData';
import {TransactionIdRequest} from '../../model/TransactionIdRequest';
import {TransactionSearchModel} from '../../model/TransactionSearchModel';
import {BigChainDBUtil} from '../../util/BigChainDBUtil';
import {BigChainService} from '../BigChainService';

/**
 * Public Key to burn a transaction
 * @type {"Gb7PjegTswkbk24kfAsrfYwYdLvh2rd5wnetSgBLn9AW"}
 */
const BURNKEY = 'Gb7PjegTswkbk24kfAsrfYwYdLvh2rd5wnetSgBLn9AW';

export class BigChainServiceImpl implements BigChainService {
    private conn: Bc;
    private organizationService: OrganizationService;

    constructor(conn: Bc, organizationService: OrganizationService) {
        this.conn = conn;
        this.organizationService = organizationService;
    }

    getHisByAssetId(getAssetInfo: GetAssetInfo): Observable<GetHisResponse[]> {
        return BigChainDBUtil.getTransactionsByAsset(this.conn, getAssetInfo.assetId, getAssetInfo.operation).pipe(flatMap(txList => {
            if (txList.length < 1) {
                return txList;
            }
            return this.transformGetHistoryByAssetId(txList);
        }));
    }

    /**
     * transformGetHistoryByAssetId. Only metadata belong to the branch.
     * Get history of asset by Consumer.
     * @param {*} historicalAssetArray - The historical AssetMetaData Array.
     * @returns historicalAsset array - The history of asset.
     */
    private transformGetHistoryByAssetId(historicalAssetArray): Observable<any> {
        const historicalAsset = [];
        const len = historicalAssetArray.length;
        const total = len - 1;
        // Add metadata
        if (historicalAssetArray[total].metadata) {
            historicalAsset.push(historicalAssetArray[total].metadata);
        }
        // For TRANSFER transaction and one or many INPUT
        if (historicalAssetArray[total].inputs[0].fulfills) {
            for (let idx = 0; idx < historicalAssetArray[total].inputs.length; idx++) {
                let previousTransId = historicalAssetArray[total].inputs[idx].fulfills.transaction_id;
                for (let idx2 = (len - 2); idx2 < len - 1; idx2--) {
                    const currentTransId = historicalAssetArray[idx2].id;
                    if (currentTransId === previousTransId) {
                        historicalAsset.push(historicalAssetArray[idx2].metadata);
                        if (historicalAssetArray[idx2].inputs[idx].fulfills) {
                            previousTransId = historicalAssetArray[idx2].inputs[idx].fulfills.transaction_id;
                        } else {
                            historicalAsset.push(historicalAssetArray[idx2].asset.data);
                            break;
                        }
                    }
                }
            }
        } else { // For CREATE transaction
            historicalAsset.push(historicalAssetArray[total].asset.data);
        }
        // return of(historicalAsset);
        return of(this.groupBy(historicalAsset, 'providerName'));
    } // End function

    // For Web
    getHisAssetByTransId(getHisByTransIdInfo: GetHisByTransIdInfo): Observable<GetHisResponse[]> {
        // Get transaction
        return BigChainDBUtil.getTransactionByTxId(this.conn, getHisByTransIdInfo.currentTransId).pipe(flatMap(currentTransaction => {
            logger.info(currentTransaction);
            // @ts-ignore
            const assetIdentity = currentTransaction.asset.id || currentTransaction.id;
            // Get history asset by assetId
            return BigChainDBUtil.getTransactionsByAsset(this.conn, assetIdentity, getHisByTransIdInfo.operation).pipe(flatMap(txList => {
                if (txList.length < 1) {
                    return txList;
                }
                return this.transformGetHistoryByTransId(txList, getHisByTransIdInfo.currentTransId);
            }));
        }));
    }

    // For Mobile
    traceProduct(transactionId: string): Observable<GetHisResponse[]> {
        // Get transaction
        return BigChainDBUtil.getTransactionByTxId(this.conn, transactionId).pipe(flatMap(currentTransaction => {
            logger.info(currentTransaction);
            // @ts-ignore
            const assetIdentity = currentTransaction.asset.id || currentTransaction.id;
            // Get history asset by assetId
            return BigChainDBUtil.getTransactionsByAsset(this.conn, assetIdentity).pipe(flatMap(txList => {
                if (txList.length < 1) {
                    return txList;
                }
                return this.transformTraceProduct(txList, transactionId);
            }));
        }));
    }

    // For Mobile
    private transformTraceProduct(historicalAssetArray, currentTransId): Observable<any> {
        const historicalAsset = [];
        const len = historicalAssetArray.length;
        // Let the last transaction in the first list
        const reverseHistoricalAssetArray = historicalAssetArray.reverse();
        let idxAll = 0;
        for (const elem of reverseHistoricalAssetArray) {
            if (currentTransId === elem.id) {
                // Add metadata
                if (elem.metadata) {
                    elem.metadata.transactionId = elem.id; // Add code to get transaction
                    historicalAsset.push(elem.metadata);
                }
                // For TRANSFER transaction and one or many INPUT
                if (elem.inputs[0].fulfills) {
                    for (let index = 0; index < elem.inputs.length; index++) {
                        let previousTransId = elem.inputs[index].fulfills.transaction_id;
                        for (let idx = (idxAll + 1); idx < len; idx++) {
                            const currentTxId = reverseHistoricalAssetArray[idx].id;
                            if (currentTxId === previousTransId) {
                                reverseHistoricalAssetArray[idx].metadata.transactionId = currentTxId; // Add code to get transaction
                                historicalAsset.push(reverseHistoricalAssetArray[idx].metadata);
                                if (reverseHistoricalAssetArray[idx].inputs[index].fulfills) {
                                    previousTransId = reverseHistoricalAssetArray[idx].inputs[index].fulfills.transaction_id;
                                } else {
                                    reverseHistoricalAssetArray[idx].asset.data.transactionId = currentTxId; // Add code to get transaction
                                    historicalAsset.push(reverseHistoricalAssetArray[idx].asset.data);
                                    break;
                                }
                            }
                        }
                    }
                } else { // For CREATE transaction
                    elem.asset.data.transactionId = elem.id; // Add code to get transaction
                    historicalAsset.push(elem.asset.data);
                }
                break;
            } // End if following for
            idxAll++;
        } // End for
        // return of(historicalAsset);
        return of(this.groupBy(historicalAsset, 'providerName'));
    } // End function

    // For Web
    /**
     * transformGetHistoryByTransId. Only metadata belong to the branch of current transaction Id.
     * Get history of asset by Consumer.
     * @param {*} historicalAssetArray - The connection of BigchainDB.
     * @param {*} currentTransId - The current transaction Id.
     * @returns historicalAsset array - The history of asset.
     */
    private transformGetHistoryByTransId(historicalAssetArray, currentTransId): Observable<any> {
        const historicalAsset = [];
        const len = historicalAssetArray.length;
        // Let the last transaction in the first list
        const reverseHistoricalAssetArray = historicalAssetArray.reverse();
        let idxAll = 0;
        for (const elem of reverseHistoricalAssetArray) {
            if (currentTransId === elem.id) {
                // Add metadata
                if (elem.metadata) {
                    elem.metadata.transactionId = elem.id; // Add code to get transaction
                    historicalAsset.push(elem.metadata);
                }
                // For TRANSFER transaction and one or many INPUT
                if (elem.inputs[0].fulfills) {
                    for (let index = 0; index < elem.inputs.length; index++) {
                        let previousTransId = elem.inputs[index].fulfills.transaction_id;
                        for (let idx = (idxAll + 1); idx < len; idx++) {
                            const currentTxId = reverseHistoricalAssetArray[idx].id;
                            if (currentTxId === previousTransId) {
                                reverseHistoricalAssetArray[idx].metadata.transactionId = currentTxId; // Add code to get transaction
                                historicalAsset.push(reverseHistoricalAssetArray[idx].metadata);
                                if (reverseHistoricalAssetArray[idx].inputs[index].fulfills) {
                                    previousTransId = reverseHistoricalAssetArray[idx].inputs[index].fulfills.transaction_id;
                                } else {
                                    reverseHistoricalAssetArray[idx].asset.data.transactionId = currentTxId; // Add code to get transaction
                                    historicalAsset.push(reverseHistoricalAssetArray[idx].asset.data);
                                    break;
                                }
                            }
                        }
                    }
                } else { // For CREATE transaction
                    elem.asset.data.transactionId = elem.id; // Add code to get transaction
                    historicalAsset.push(elem.asset.data);
                }
                break;
            } // End if following for
            idxAll++;
        } // End for
        // return of(historicalAsset);
        return of(this.groupBy(historicalAsset, 'providerName'));
    } // End function

    private groupBy(list, key) {
        const newGroup = {};
        list.forEach(item => {
            if (item) {
                const newItem = Object.assign({}, item);
                delete newItem[key];
                newGroup[item[key]] = newGroup[item[key]] || [];
                newGroup[item[key]].push(newItem);
            }
        });
        return newGroup;
    }

    getTransaction(transactionId: string): Observable<BigChainTransaction> {
        return BigChainDBUtil.getTransactionByTxId(this.conn, transactionId);
    }

    getSourcesForCreateAsset(getOutputInfoAll: GetOutputInfoAll): Observable<GetListResponse[]> {
        const getOutputInfoUnspended = new GetOutputInfo();
        getOutputInfoUnspended.publicKey = getOutputInfoAll.publicKey;
        getOutputInfoUnspended.spent = false;
        const unspended = this.getListOutputs(getOutputInfoUnspended);
        return zip(unspended).pipe(flatMap(result => {
            const arrSpendedUnspendedOuwner = [];
            for (let idx2 = 0; idx2 < result[0].length; idx2++) {
                if ((getOutputInfoAll.isCreatorOwner) && (getOutputInfoAll.publicKey === result[0][idx2].creatorPublicKey && !result[0][idx2].spentStatus)) {
                    arrSpendedUnspendedOuwner.push(result[0][idx2]);
                } else if ((!getOutputInfoAll.isCreatorOwner) && (getOutputInfoAll.publicKey !== result[0][idx2].creatorPublicKey) && !result[0][idx2].spentStatus) {
                    arrSpendedUnspendedOuwner.push(result[0][idx2]);
                }
            }
            return of(arrSpendedUnspendedOuwner);
        }));
    }

    getListOuputUnspentOfTx(getListOuputUnspentOfTx: GetListOuputUnspentOfTx): Observable<GetListResponse[]> {
        // Get list all unspended, spended
        const getOutputInfoUnspended = new GetOutputInfo();
        getOutputInfoUnspended.publicKey = getListOuputUnspentOfTx.publicKey;
        getOutputInfoUnspended.spent = false;
        const unspended = this.getListOutputs(getOutputInfoUnspended);
        return zip(unspended).pipe(flatMap(result => {
            const arrUnspendedOuwner = [];
            for (let idx = 0; idx < result[0].length; idx++) {
                if ((getListOuputUnspentOfTx.publicKey !== result[0][idx].creatorPublicKey) && (result[0][idx].transactionId === getListOuputUnspentOfTx.transactionId)) {
                    arrUnspendedOuwner.push(result[0][idx]);
                }
            }
            return of(arrUnspendedOuwner);
        }));
    }

    searchAssets(searchModel: TransactionSearchModel): Observable<SearchResult<GetListResponse>> {
        const getOutputInfo = new GetOutputInfo();
        getOutputInfo.publicKey = searchModel.publicKey;
        getOutputInfo.spent = searchModel.spentStatus;
        const listOutputs = this.getListOutputs(getOutputInfo);
        return zip(listOutputs).pipe(flatMap(result => {
            return this.searchAssetsByKeysAndSort(result, searchModel);
        }));
    }

    /**
     * searchAssetsByKeysAndSort
     * Get unspent sources that belong owner.
     * @param listAllAssets - The listAllAssets.
     * @param searchModel - The searchModel.
     * @returns {any[]}
     */
    private searchAssetsByKeysAndSort(listAllAssets, searchModel): Observable<SearchResult<any>> {
        const arrAssetsResponse = new SearchResult();
        if (listAllAssets[0].length === 0) {
            arrAssetsResponse.itemTotal = 0;
            arrAssetsResponse.results = [];
            return of(arrAssetsResponse);
        }
        // if (listAllAssets[0].length === 1) {
        //     arrAssetsResponse.itemTotal = 1;
        //     arrAssetsResponse.results = listAllAssets[0];
        //     return of(arrAssetsResponse);
        // }
        const arrAssets = [];
        // Serach for keys
        if (searchModel.productLine || searchModel.productDescription || searchModel.providerName
            || searchModel.transactionId || searchModel.assetId || searchModel.amount || searchModel.timeStamp) {
            arrAssets[0] = listAllAssets[0].filter(item => {
                let condition = null;
                if (searchModel.productLine) {
                    const temp = item.assetData.contents.productLine.toLowerCase().indexOf(searchModel.productLine.toLowerCase()) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.productDescription) {
                    const temp = item.assetData.contents.productDescription.toLowerCase().indexOf(searchModel.productDescription.toLowerCase()) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.providerName) {
                    const temp = item.assetData.providerName.toLowerCase().indexOf(searchModel.providerName.toLowerCase()) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.transactionId) {
                    const temp = item.transactionId.toLowerCase().indexOf(searchModel.transactionId.toLowerCase()) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.assetId) {
                    const temp = item.assetId.toLowerCase().indexOf(searchModel.assetId.toLowerCase()) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.amount && searchModel.amount !== 'NaN') {
                    const temp = item.amount === searchModel.amount;
                    condition = condition !== null ? condition && temp : temp;
                }
                if (searchModel.timeStamp) {
                    // const temp = new Date(item.assetData.timeStamp).setHours(0, 0, 0, 0) === new Date(searchModel.timeStamp).setHours(0, 0, 0, 0);
                    const temp = item.assetData.timeStamp.indexOf(searchModel.timeStamp) !== -1;
                    condition = condition !== null ? condition && temp : temp;
                }
                return condition;
            });
        } else {
            arrAssets[0] = listAllAssets[0];
        }
        // Handle sort and pagination
        let arrAssetsResults = arrAssets[0];
        const toTal = arrAssetsResults.length;

        // Sort by field
        const nestedSort = (prop1, prop2, prop3, direction = 'ASC') => (e1, e2) => {
            const a = prop2 ? e1[prop1][prop2][prop3] : e1[prop1],
                b = prop2 ? e2[prop1][prop2][prop3] : e2[prop1],
                sortOrder = direction === 'ASC' ? 1 : -1;
            let aInt, bInt;
            if (!prop2) {
                aInt = parseInt(a, 10);
                bInt = parseInt(b, 10);
                return (aInt < bInt) ? -sortOrder : (aInt > bInt) ? sortOrder : 0;
            } else {
                return (a < b) ? -sortOrder : (a > b) ? sortOrder : 0;
            }
        };
        const sortField = searchModel.sortField;
        const sortType = searchModel.sortType || 'ASC';
        if (sortField && (sortType === 'ASC' || sortType === 'DESC')) {
            if (sortField === 'amount') {
                arrAssetsResults.sort(nestedSort(sortField, null, null, sortType));
            } else if (sortField === 'productLine' || sortField === 'productDescription' || sortField === 'providerName') {
                arrAssetsResults.sort(nestedSort('assetData', 'contents', sortField, sortType));
            }
        }

        // Pagination
        if (searchModel.pageIndex && searchModel.pageSize) {
            // tslint:disable-next-line:radix
            const itemStart = (parseInt(searchModel.pageIndex) - 1) * parseInt(searchModel.pageSize);
            // tslint:disable-next-line:radix
            const itemEnd = itemStart + parseInt(searchModel.pageSize);
            arrAssetsResults = arrAssetsResults.slice(itemStart, itemEnd);
        }

        // Transform to SearchResult
        arrAssetsResponse.itemTotal = toTal;
        arrAssetsResponse.results = arrAssetsResults;
        return of(arrAssetsResponse);
    }

    private getListOutputs(getOutputInfo: GetOutputInfo): Observable<GetListResponse[]> {
        // Get List TxId Outputs
        return BigChainDBUtil.getTransactionIdsByPublicKey(this.conn, getOutputInfo.publicKey, getOutputInfo.spent).pipe(flatMap(listTxIdOutputsArr => {
            // Transform data
            return this.transformGetOutputInfoResponse(listTxIdOutputsArr, getOutputInfo);
        }));
    }

    /**
     * transformGetOutputInfoResponse
     * set data for transformGetOutputInfoResponse.
     * @param {*} listTxIdOutputsArr - The listTxIdOutputsArr.
     * @param {*} getOutputInfo - The getOutputInfo.
     * @returns {*} TransactionInfoResponse - The TransactionInfoResponse object.
     */
    private transformGetOutputInfoResponse(listTxIdOutputsArr, getOutputInfo: GetOutputInfo): Observable<GetListResponse[]> {
        return fromPromise(new Promise((resolve, reject) => {
            let listOutputsArrPro = [];
            const newKeys = {transaction_id: 'transactionId', output_index: 'outputIndex'};
            if (listTxIdOutputsArr.length > 0) {
                const cnn = this.conn;
                listOutputsArrPro = listTxIdOutputsArr.map(function (elem) {
                    return BigChainDBUtil.getTransactionByTxId(cnn, elem.transaction_id).toPromise()
                        .then(currentTx => {
                            // Add more keys and values
                            elem.spentStatus = getOutputInfo.spent;
                            elem.currentPublicKey = currentTx.outputs[elem.output_index].public_keys[0];
                            elem.amount = currentTx.outputs[elem.output_index].amount;
                            elem.metaData = currentTx.metadata;
                            // @ts-ignore
                            elem.assetId = currentTx.asset.id || elem.transaction_id;
                            return BigChainDBUtil.getTransactionByTxId(cnn, elem.assetId).toPromise()
                                .then(response => {
                                    elem.creatorPublicKey = response.inputs[0].owners_before[0];
                                    // @ts-ignore
                                    elem.assetData = response.asset.data;
                                    return elem;
                                });
                        })
                        .catch(err => {
                            logger.info(err);
                            return reject(new Error(err));
                        });
                });
                Promise.all(listOutputsArrPro).then(() => {
                    // Rename keys {transaction_id => 'transactionId', output_index => 'outputIndex'};
                    const listTxIdOutputs = [];
                    listTxIdOutputsArr.forEach(elem => {
                        elem = JsonUtil.renameKeys(elem, newKeys);
                        listTxIdOutputs.push(elem);
                    });
                    return listTxIdOutputs;
                }).then(response => {
                    return resolve(response.reverse());
                });
            } else {
                return resolve([]);
            }
        }));
    }
    //////////////////////////
    getSearchTxIdByItemId(itemIds: string[]): Observable<any> {
        return fromPromise(new Promise((resolve, reject) => {
            let listItemIds = [];
            if (itemIds.length > 0) {
                const cnn = this.conn;
                listItemIds = itemIds.map(function (elem) {
                    return BigChainDBUtil.getSearchMetadata(cnn, elem).toPromise()
                        .then(currentTx => {
                            let transactionId = '';
                            if (currentTx.length > 0) {
                                transactionId = currentTx[currentTx.length - 1].id;
                            }
                            listItemIds.push({itemId: elem, transactionId: transactionId});
                            // return transactionId;
                        })
                        // .then (resp => {
                        //     listItemIds.push(resp);
                        // })
                        .catch(err => {
                            logger.info(err);
                            return reject(new Error(err));
                        });
                });
                Promise.all(listItemIds).then(() => {
                    return listItemIds;
                }).then(response => {
                    const listTxIdOutputs = [];
                    listItemIds.forEach(elem => {
                        if (Object.keys(elem).length !== 0) {
                            listTxIdOutputs.push(elem);
                        }
                    });
                    return resolve(listTxIdOutputs);
                });
            } else {
                return resolve([]);
            }
        }));
    }

    getSearchItemIdByTxId(txIds: string[]): Observable<any> {
        return fromPromise(new Promise((resolve, reject) => {
            let listItemIds = [];
            if (txIds.length > 0) {
                const cnn = this.conn;
                listItemIds = txIds.map((elem) => {
                    return this.traceProduct(elem).toPromise()
                        .then(listHisByTransIdInfo => {
                            if (listHisByTransIdInfo) {
                                // get itemId, productId and organizationId
                                const itemId = JsonUtil.findKey(listHisByTransIdInfo, 'itemId');
                                if (itemId) {
                                    listItemIds.push({itemId: itemId, transactionId: elem});
                                } else {
                                    listItemIds.push({itemId: '', transactionId: elem});
                                }
                            } else {
                                listItemIds.push({itemId: '', transactionId: elem});
                            }
                    })
                        .catch(err => {
                            listItemIds.push({itemId: '', transactionId: elem});
                            // logger.info(err);
                            // return reject(new Error(err));
                        });
                });
                Promise.all(listItemIds).then(() => {
                    return listItemIds;
                }).then(response => {
                    const listTxIdOutputs = [];
                    listItemIds.forEach(elem => {
                        if (Object.keys(elem).length !== 0) {
                            listTxIdOutputs.push(elem);
                        }
                    });
                    return resolve(listTxIdOutputs);
                });
            } else {
                return resolve([]);
            }
        }));
    }

    getSearchTxIdByItemIdInList(itemIds: string, listTrans: any): Observable<any> {
        return fromPromise(new Promise((resolve, reject) => {
            let listItemIds = [];
            if (itemIds) {
                const cnn = this.conn;
                listItemIds = listTrans.map((elem) => {
                    const getHisByTransIdInfo = new GetHisByTransIdInfo();
                    getHisByTransIdInfo.currentTransId = elem.transaction_id;
                    return this.getHisAssetByTransId(getHisByTransIdInfo).toPromise()
                        .then(traceAsset => {
                            const itemId = JsonUtil.findKey(traceAsset, 'itemId');
                            if (itemId && (itemId === itemIds)) {
                                listItemIds.push({itemId: itemIds, transactionId : elem.transaction_id});
                                // resolve(listItemIds);
                            }
                        })
                        .catch(err => {
                            logger.info(err);
                            return reject(new Error(err));
                        });
                });
                Promise.all(listItemIds).then(() => {
                    return listItemIds;
                }).then(response => {
                    const listTxIdOutputs = [];
                    listItemIds.forEach(elem => {
                        if (Object.keys(elem).length !== 0) {
                            listTxIdOutputs.push(elem);
                        }
                    });
                    return resolve(listTxIdOutputs);
                });
            } else {
                return resolve([]);
            }
        }));
    }

    //////////////////////////
    createAsset(identity: Identity, transaction: TransactionData): Observable<Result<TransactionData>> {
        // Assign amount
        const aMount = transaction.amount;
        // Get provider name
        return this.organizationService.getOrgByOrgId(transaction.providerId).pipe(flatMap(org => {
            // Build asset and metadata
            const assetData = this.setAssetMetaData(org, transaction);
            let metaData;
            if (transaction.metaData) {
                metaData = this.setAssetMetaData(org, transaction.metaData);
            }
            // Create a CREATE transaction.
            const createdTransaction = driver.Transaction.makeCreateTransaction(
                assetData,
                metaData,
                [driver.Transaction.makeOutput(
                    driver.Transaction.makeEd25519Condition(identity.publicKey), aMount.toString())],
                identity.publicKey
            );
            // Sign the transaction
            const signedTransaction = driver.Transaction.signTransaction(createdTransaction, identity.privateKey);
            logger.info('signedTransaction', signedTransaction);
            // Post the transaction to the network
            return BigChainDBUtil.postTransactionByComitMode(this.conn, signedTransaction).pipe(map(successfullyPostedTransaction => {
                // Transform data
                return this.transformTransactionInfo(successfullyPostedTransaction);
            }));
        }));
    }

    private setAssetMetaData(orgObj: Organization, data: AssetMetaData) {
        return {
            // Add for Mobile
            companyid: orgObj._id,
            providerName: orgObj.organizationName,
            logo: orgObj.imageUrl,
            description: orgObj.description,
            location: orgObj.location,
            providerAddress: orgObj.organizationAddress,
            contents : data.contents,
            sources: data.sources,
            noteAction : data.noteAction,
            timeStamp : new Date()
        };
    }

    private transformTransactionInfo(successfullyPostedTransaction: BigChainTransaction): Result<TransactionData> {
        const result = new Result<TransactionData>();
        result.status = StatusCode.Success;
        const transaction = new TransactionData();
        transaction.transactionId = successfullyPostedTransaction.id;
        result.model = transaction;
        return result;
    }

    transferAsset(transactionIdRequest: TransactionIdRequest, orgId: string, metaData: AssetMetaData): Observable<Result<TransactionData>> {
        // Validate transactionIdRequest
        const errorCode = this.validateTransactionIdRequest(transactionIdRequest);
        if (errorCode) {
            const result = new Result<TransactionData>();
            result.status = errorCode;
            const transaction = new TransactionData();
            transaction.transactionId = transactionIdRequest.transactionId;
            result.model = transaction;
            return of(result);
        }
        // Get provider name
        return this.organizationService.getOrgByOrgId(transactionIdRequest.providerId).pipe(flatMap(org => {
            // Build metadata
            const mData = this.setAssetMetaData(org, metaData);
            // Transfer asset
            return this.organizationService.getPublicKeyByOrgId(orgId).pipe(flatMap((publicKey) => {
                return BigChainDBUtil.transferAsset(this.conn, transactionIdRequest.transactionId,
                    transactionIdRequest.outputIndex,
                    transactionIdRequest.identity.privateKey,
                    mData,
                    publicKey).pipe(map(transaction => {
                    logger.info(transaction);
                    return this.transformTransactionInfo(transaction);
                }));
            }));
        }));
    }

    appendMetaData(transactionIdRequest: TransactionIdRequest, metaData: AssetMetaData): Observable<Result<TransactionData>> {
        // Validate transactionIdRequest
        const errorCode = this.validateTransactionIdRequest(transactionIdRequest);
        if (errorCode) {
            const result = new Result<TransactionData>();
            result.status = errorCode;
            const transaction = new TransactionData();
            transaction.transactionId = transactionIdRequest.transactionId;
            result.model = transaction;
            return of(result);
        }
        // Get provider name
        return this.organizationService.getOrgByOrgId(transactionIdRequest.providerId).pipe(flatMap(org => {
            // Build metadata
            const mData = this.setAssetMetaData(org, metaData);
            // Append metadata
            return BigChainDBUtil.transferAsset(this.conn, transactionIdRequest.transactionId,
                transactionIdRequest.outputIndex,
                transactionIdRequest.identity.privateKey,
                mData,
                null).pipe(map(transaction => {
                logger.info(transaction);
                return this.transformTransactionInfo(transaction);
            }));
        }));
    }

    burnAsset(transactionIdRequest: TransactionIdRequest): Observable<Result<TransactionData>> {
        // Validate transactionIdRequest
        const errorCode = this.validateTransactionIdRequest(transactionIdRequest);
        if (errorCode) {
            const result = new Result<TransactionData>();
            result.status = errorCode;
            const transaction = new TransactionData();
            transaction.transactionId = transactionIdRequest.transactionId;
            result.model = transaction;
            return of(result);
        }
        // Burn AssetMetaData
        // Get provider name
        return this.organizationService.getOrgByOrgId(transactionIdRequest.providerId).pipe(flatMap(org => {
            const metaData = new AssetMetaData();
            metaData.noteAction = 'Burn transaction';
            const mData = this.setAssetMetaData(org, metaData);
            return BigChainDBUtil.transferAsset(this.conn, transactionIdRequest.transactionId,
                transactionIdRequest.outputIndex,
                transactionIdRequest.identity.privateKey,
                mData,
                BURNKEY).pipe(map(transaction => {
                logger.info(transaction);
                return this.transformTransactionInfo(transaction);
            }));
        }));
    }

    divideAsset(transactionIdRequest: TransactionIdRequest, divideContent: DivideContent[]): Observable<Result<TransactionData>> {
        // Validate transactionIdRequest
        const errorCode = this.validateTransactionIdRequest(transactionIdRequest);
        if (errorCode) {
            const result = new Result<TransactionData>();
            result.status = errorCode;
            const transaction = new TransactionData();
            transaction.transactionId = transactionIdRequest.transactionId;
            result.model = transaction;
            return of(result);
        }
        // Get provider name
        return this.organizationService.getOrgByOrgId(transactionIdRequest.providerId).pipe(flatMap(org => {
            // Divide asset
            return BigChainDBUtil.divideAsset(this.conn, transactionIdRequest.transactionId,
                transactionIdRequest.outputIndex,
                transactionIdRequest.identity.privateKey,
                transactionIdRequest.identity.publicKey,
                divideContent, org).pipe(map(transaction => {
                logger.info(transaction);
                return this.transformTransactionInfo(transaction);
            }));
        }));
    }

    private validateTransactionIdRequest(transactionIdRequest: TransactionIdRequest): StatusCode {
        let errorCode = null;
        if (!transactionIdRequest) {
            errorCode = StatusCode.Error;
        } else if (!transactionIdRequest.transactionId) {
            errorCode = StatusCode.InvalidDestination;
        } else if (!transactionIdRequest.identity.privateKey) {
            errorCode = StatusCode.Forbidden;
        }
        return errorCode;
    }

    getTransactionIdsByPublicKey(publicKey: string, spent?: boolean): Observable<any> {
        return BigChainDBUtil.getTransactionIdsByPublicKey(this.conn, publicKey, false);
    }

}
