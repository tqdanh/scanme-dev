import {Request, Response} from 'express';
import {of} from 'rxjs';
import {isNumeric} from 'rxjs/internal-compatibility';
import {flatMap, map, mergeMap} from 'rxjs/operators';
import {AuthorizationToken} from '../../common/AuthorizationToken';
import {logger} from '../../common/logging/logger';
import {JsonUtil} from '../../common/util/JsonUtil';
import {Item} from '../../org-bigchaindb-backend/model/Item';
import {IdentityService} from '../../org-bigchaindb-backend/service/IdentityService';
import {ItemService} from '../../org-bigchaindb-backend/service/ItemService';
import {OrganizationService} from '../../org-bigchaindb-backend/service/OrganizationService';
import {AssetMetaData} from '../model/AssetMetaData';
import {CreateTransactionData} from '../model/CreateTransactionData';
import {GetAssetInfo} from '../model/GetAssetInfo';
import {GetHisByTransIdInfo} from '../model/GetHisByTransIdInfo';
import {GetListOuputUnspentOfTx} from '../model/GetListOuputUnspentOfTx';
import {GetOutputInfoAll} from '../model/GetOutputInfoAll';
import {StatusCode} from '../model/StatusCode';
import {TransactionData} from '../model/TransactionData';
import {TransactionIdRequest} from '../model/TransactionIdRequest';
import {TransactionSearchModel} from '../model/TransactionSearchModel';
import {BigChainService} from '../service/BigChainService';
import {BigChainServiceImpl} from '../service/impl/BigChainServiceImpl';
import {BigChainDBUtil} from '../util/BigChainDBUtil';

export class BigChainController {

    // Hard code for testing
    private IDENTITY = {
        identityId: '123456',
        privateKey: '79ByUAe6SXnfWdNLup2dXfnezmDPU7M6gauBiHMAZjPJ',
        publicKey: '86QhiwW4tfQ1UCC54JQ9qNxcfHf3s62TgpifYJycq42Z'
    };
    private providerId = '0ecd5e22906e49bda7bd0563c842a6a5';
    // End Hard code

    constructor(
        private bigChainService: BigChainService,
        private identityService: IdentityService,
        private organizationService: OrganizationService,
        private itemService: ItemService
    ) {
    }

    getSearchTxIdByItemId(req: Request, res: Response) {
        if (!req.body) {
            throw new ClientError('No body');
        }
        // Call service
        console.log('getSearchTxIdByItemId: ' + req.body);
        return this.bigChainService.getSearchTxIdByItemId(req.body).subscribe(
            resData => this.handleResponse(res, resData),
            err => this.handleError(res, err)
        );
    }

    getSearchItemIdByTxId(req: Request, res: Response) {
        if (!req.body) {
            throw new ClientError('No body');
        }
        // Call service
        console.log('getSearchItemIdByTxId: ' + req.body);
        return this.bigChainService.getSearchItemIdByTxId(req.body).subscribe(
            resData => this.handleResponse(res, resData),
            err => this.handleError(res, err)
        );
    }

    getSearchTxIdByItemIdInList(req: Request, res: Response) {
        if (!req.query.itemId) {
            throw new ClientError('No Item id');
        }
        // Call service
        console.log('getSearchTxIdByItemIdInList: ' + req.query.itemId);
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            // Get publicKey
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                const publicKey = identity.publicKey;
                // Call service
                console.log('getSearchTxIdByItemIdInList: ' + JSON.stringify(publicKey));

                return this.bigChainService.getTransactionIdsByPublicKey(publicKey, false).pipe(flatMap(listTrans => {
                    return this.bigChainService.getSearchTxIdByItemIdInList(req.query.itemId, listTrans).pipe(flatMap(transaction => {
                        return of(transaction);
                    }));
                }));

            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            const publicKey = this.IDENTITY.publicKey;
            // Hard code for test fronend without token
            // Call service
            console.log('getSearchTxIdByItemIdInList: ' + JSON.stringify(publicKey));

            return this.bigChainService.getTransactionIdsByPublicKey(publicKey, false).pipe(flatMap(listTrans => {
                return this.bigChainService.getSearchTxIdByItemIdInList(req.query.itemId, listTrans).pipe(flatMap(transaction => {
                    return of(transaction);
                }));

            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    getHisByAssetId(req: Request, res: Response) {
        // Set data
        let getAssetInfo;
        try {
            getAssetInfo = this.setDataForGetHisByAssetId(req.query);
        } catch (err) {
            throw new ClientError(err);
        }
        // Call service
        console.log('getHisByAssetId: ' + JSON.stringify(getAssetInfo));
        return this.bigChainService.getHisByAssetId(getAssetInfo).subscribe(
            resData => this.handleResponse(res, resData),
            err => this.handleError(res, err)
        );
    }

    /**
     * setDataForGetHisByAssetId
     * set data for GetHisByAssetId.
     * @param {*} request - The request from client.
     * @returns {*} set data result.
     */
    private setDataForGetHisByAssetId(request) {
        if (!request.assetId) {
            throw new Error('Set Data is failed: No assetId');
        }
        const getAssetInfo = new GetAssetInfo();
        getAssetInfo.assetId = request.assetId;
        getAssetInfo.operation = request.operation || null;
        if (getAssetInfo) {
            return getAssetInfo;
        } else {
            throw new Error('Set Data is failed' + JSON.stringify(getAssetInfo));
        }
    }

    getHisAssetByTransId(req: Request, res: Response) {
        // Set data
        let getHisByTransIdInfo;
        try {
            getHisByTransIdInfo = this.setDataForGetHisAssetByTransId(req.query);
        } catch (err) {
            throw new ClientError(err);
        }
        // Call service
        console.log('getHisAssetByTransId: ' + JSON.stringify(getHisByTransIdInfo));
        return this.bigChainService.getHisAssetByTransId(getHisByTransIdInfo).subscribe(
            resData => this.handleResponse(res, resData),
            err => this.handleError(res, err)
        );
    }

    getTransaction(req: Request, res: Response) {
        // Set data
        let transactionId;
        try {
            transactionId = req.query.transactionId;
        } catch (err) {
            throw new ClientError(err);
        }
        // Call service
        console.log('getTransaction: ' + JSON.stringify(transactionId));
        return this.bigChainService.getTransaction(transactionId).subscribe(
            resData => this.handleResponse(res, resData),
            err => this.handleError(res, err)
        );
    }

    /**
     * setDataForGetHisAssetByTransId
     * set data for GetHisAssetByTransId.
     * @param {*} request - The request from client.
     * @returns {*} set data result.
     */
    private setDataForGetHisAssetByTransId(request) {
        if (!request.currentTransId) {
            throw new Error('Set Data is failed: No currentTransId');
        }
        const getHisByTransIdInfo = new GetHisByTransIdInfo();
        getHisByTransIdInfo.currentTransId = request.currentTransId;
        getHisByTransIdInfo.operation = request.operation || undefined;
        if (getHisByTransIdInfo) {
            return getHisByTransIdInfo;
        } else {
            throw new Error('Set Data is failed' + JSON.stringify(getHisByTransIdInfo));
        }
    }

    getSourcesForCreateAsset(req: Request, res: Response) {
        // Set data
        const getOutputInfoAll = new GetOutputInfoAll();
        getOutputInfoAll.isCreatorOwner = req.query.isCreatorOwner === 'true';
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            // Get publicKey
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                getOutputInfoAll.publicKey = identity.publicKey;
                // Call service
                console.log('getListAllbyPublickeyToken: ' + JSON.stringify(getOutputInfoAll));
                return this.bigChainService.getSourcesForCreateAsset(getOutputInfoAll);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            getOutputInfoAll.publicKey = this.IDENTITY.publicKey;
            // Hard code for test fronend without token
            // Call service
            console.log('getSourcesForCreateAsset: ' + JSON.stringify(getOutputInfoAll));
            return this.bigChainService.getSourcesForCreateAsset(getOutputInfoAll).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    getListOuputUnspentOfTx(req: Request, res: Response) {
        const getListOuputUnspentOfTx = new GetListOuputUnspentOfTx();
        getListOuputUnspentOfTx.transactionId = req.query.transactionId;
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                getListOuputUnspentOfTx.publicKey = identity.publicKey;
                // Call service
                console.log('getListOuputUnspentOfTxToken: ' + JSON.stringify(getListOuputUnspentOfTx));
                return this.bigChainService.getListOuputUnspentOfTx(getListOuputUnspentOfTx);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            getListOuputUnspentOfTx.publicKey = this.IDENTITY.publicKey;
            // Call service
            console.log('getListOuputUnspentOfTx: ' + JSON.stringify(getListOuputUnspentOfTx));
            return this.bigChainService.getListOuputUnspentOfTx(getListOuputUnspentOfTx).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    // Search assets with pagination and sort.
    searchAssets(req: Request, res: Response) {
        // Set data
        let transactionSeachModel;
        try {
            transactionSeachModel = this.setDataForSearchAsset(req.query);
        } catch (err) {
            throw new ClientError(err);
        }
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            // Get privateKey
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                transactionSeachModel.publicKey = identity.publicKey;
                // Call service
                console.log('searchAssetsToken: ' + JSON.stringify(transactionSeachModel));
                return this.bigChainService.searchAssets(transactionSeachModel);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );

        } else {
            transactionSeachModel.publicKey = this.IDENTITY.publicKey;
            // Call service
            console.log('searchAssets: ' + JSON.stringify(transactionSeachModel));
            return this.bigChainService.searchAssets(transactionSeachModel).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    /**
     * setDataForSearchAsset
     * set data for AssetContentForSearch.
     * @param {*} request - The request from client.
     * @returns {*} set data result.
     */
    private setDataForSearchAsset(request) {
        const transactionSeachModel = new TransactionSearchModel();
        transactionSeachModel.publicKey = request.publicKey;
        transactionSeachModel.productLine = request.productLine || null;
        transactionSeachModel.productDescription = request.productDescription || null;
        transactionSeachModel.providerName = request.providerName || null;
        transactionSeachModel.spentStatus = request.spentStatus === 'true';
        transactionSeachModel.transactionId = request.transactionId || null;
        transactionSeachModel.assetId = request.assetId || null;
        transactionSeachModel.amount = request.amount || null;
        transactionSeachModel.timeStamp = request.timeStamp || null;
        transactionSeachModel.sortField = request.sortField || null;
        transactionSeachModel.sortType = request.sortType || 'ASC';
        transactionSeachModel.pageIndex = request.pageIndex || null;
        transactionSeachModel.pageSize = request.pageSize || null;
        return transactionSeachModel;
    }

    // createAsset(identity: Identity, asset: AssetMetaData): Observable<Result<AssetMetaData>>;
    createAsset(req: Request, res: Response) {
        // Set data
        // Asset data
        const createTransactionData = new TransactionData();
        // createTransactionData.providerId = req.body.providerId;
        createTransactionData.contents = req.body.contents;
        createTransactionData.sources = req.body.sources;
        createTransactionData.noteAction = req.body.noteAction;
        // Calculate amount
        createTransactionData.amount = parseInt(req.body.contents.quantity, 10) * parseInt(req.body.contents.unit, 10);
        // Meta data
        if (req.body.metaData) {
            const metaData = new AssetMetaData();
            metaData.contents = req.body.metaData.contents;
            metaData.sources = req.body.metaData.sources;
            metaData.noteAction = req.body.metaData.noteAction;
            createTransactionData.metaData = metaData;
        }
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                // Call service
                createTransactionData.providerId = authenticationToken.providerId;
                    console.log('createAsset: ' + JSON.stringify(createTransactionData));
                return this.bigChainService.createAsset(identity, createTransactionData);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            createTransactionData.providerId = this.providerId;
            // Call service
            console.log('createAsset: ' + JSON.stringify(createTransactionData));
            return this.bigChainService.createAsset(this.IDENTITY, createTransactionData).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }


    // importCreateAsset(identity: Identity, asset: AssetMetaData): Observable<Result<AssetMetaData>>;
    importCreateAsset(req: Request, res: Response) {
        // Set data
        if (!req.body.length) {
            return res.status(400).end('No Data');
            // throw new ClientError('No data');
        }
        const createTransactionDataList = [];
        for (let i = 0; i < req.body.length; i++) {
            // Validate json
            if (!req.body[i].productLine || !req.body[i].productDescription || !req.body[i].quantity || !req.body[i].unit || !isNumeric(req.body[i].quantity) || !isNumeric(req.body[i].unit)) {
                return res.status(400).end('Invalid format at the line: ' + i.toString());
            }
            // Asset data
            const createTransactionData = new TransactionData();
            createTransactionData.contents = {
                    productLine: req.body[i].productLine,
                    productDescription: req.body[i].productDescription,
                    quantity: req.body[i].quantity,
                    unit: req.body[i].unit
                };
            createTransactionData.noteAction = 'Adding asset';
            // Calculate amount
            createTransactionData.amount = parseInt(req.body[i].quantity, 10) * parseInt(req.body[i].unit, 10);
            createTransactionDataList.push(createTransactionData);
        }
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(map((identity) => {
                // Call service
                createTransactionDataList.forEach(elem => {
                    elem.providerId = authenticationToken.providerId;
                    // this.bigChainService.createAsset(identity, elem);
                });
                let listItemIds = [];
                listItemIds = createTransactionDataList.map((elem) => {
                    return this.bigChainService.createAsset(identity, elem).toPromise()
                        .then(transaction => {
                            const txId = transaction.model.transactionId;
                            listItemIds.push(txId);
                        })
                        .catch(err => {
                            return err;
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
                    return listTxIdOutputs;
                });
            })).subscribe(
                resData => res.status(200).json(resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            createTransactionDataList.forEach(elem => {
                elem.providerId = this.providerId;
            });
            let listItemIds = [];
            listItemIds = createTransactionDataList.map((elem) => {
                    return this.bigChainService.createAsset(this.IDENTITY, elem).toPromise()
                        .then(transaction => {
                            const txId = transaction.model.transactionId;
                            listItemIds.push(txId);
                        })
                        .catch(err => {
                            return this.handleError(res, err);
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
                return res.status(200).json(listTxIdOutputs);
            });
    }}


    transferAsset(req: Request, res: Response) {
        // Set data
        const transactionIdRequest = new TransactionIdRequest();
        transactionIdRequest.transactionId = req.query.transactionId;
        transactionIdRequest.outputIndex = parseInt(req.query.outputIndex, 10);
        // transactionIdRequest.providerId = req.body.providerId;
        // Meta data
        const metaData = new AssetMetaData();
        metaData.contents = req.body.contents;
        metaData.noteAction = req.body.noteAction;
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                // Set identity
                transactionIdRequest.identity = identity;
                transactionIdRequest.providerId = authenticationToken.providerId;
                // Call service
                console.log('transferAsset: ' + JSON.stringify(transactionIdRequest));
                return this.bigChainService.transferAsset(transactionIdRequest, req.query.orgId, metaData);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            transactionIdRequest.identity = this.IDENTITY;
            transactionIdRequest.providerId = this.providerId;
            // Hard code for test fronend without token
            // Call service
            console.log('transferAsset: ' + JSON.stringify(transactionIdRequest));
            return this.bigChainService.transferAsset(transactionIdRequest, req.query.orgId, metaData).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    appendMetaData(req: Request, res: Response) {
        // Set data
        const transactionIdRequest = new TransactionIdRequest();
        transactionIdRequest.transactionId = req.query.transactionId;
        transactionIdRequest.outputIndex = parseInt(req.query.outputIndex, 10);
        // transactionIdRequest.providerId = req.body.providerId;
        // Meta data
        const metaData = new AssetMetaData();
        metaData.contents = req.body.contents;
        metaData.noteAction = req.body.noteAction;
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                // Set identity
                transactionIdRequest.identity = identity;
                transactionIdRequest.providerId = authenticationToken.providerId;
                // Call service
                console.log('appendMetaData: ' + JSON.stringify(transactionIdRequest));
                if (metaData.contents.itemId) {
                    const obj = new Item();
                    obj.actionCode = 1;
                    return this.itemService.updateActionCodeItem(obj, metaData.contents.itemId).pipe(flatMap(resp => {
                        return this.bigChainService.appendMetaData(transactionIdRequest, metaData);
                    }));
                } else {
                    return this.bigChainService.appendMetaData(transactionIdRequest, metaData);
                }
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            transactionIdRequest.identity = this.IDENTITY;
            transactionIdRequest.providerId = this.providerId;
            // Hard code for test fronend without token
            // Call service
            console.log('appendMetaData: ' + JSON.stringify(transactionIdRequest));
            if (metaData.contents.itemId) {
                const obj = new Item();
                obj.actionCode = 1;
                return this.itemService.updateActionCodeItem(obj, metaData.contents.itemId).pipe(flatMap(resp => {
                    return this.bigChainService.appendMetaData(transactionIdRequest, metaData);
                })).subscribe(
                    resData => this.handleResponse(res, resData),
                    err => this.handleError(res, err)
                );
            } else {
                return this.bigChainService.appendMetaData(transactionIdRequest, metaData).subscribe(
                    resData => this.handleResponse(res, resData),
                    err => this.handleError(res, err)
                );
            }
        }
    }

    burnAsset(req: Request, res: Response) {
        const transactionIdRequest = new TransactionIdRequest();
        transactionIdRequest.transactionId = req.query.transactionId;
        transactionIdRequest.outputIndex = parseInt(req.query.outputIndex, 10);
        // transactionIdRequest.providerId = req.body.providerId;
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                // Set identity
                transactionIdRequest.identity = identity;
                transactionIdRequest.providerId = authenticationToken.providerId;
                // Call service
                console.log('burnAsset: ' + JSON.stringify(transactionIdRequest));
                return this.bigChainService.burnAsset(transactionIdRequest);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Set data
            // Hard code for test fronend without token
            transactionIdRequest.identity = this.IDENTITY;
            transactionIdRequest.providerId = this.providerId;
            // Hard code for test fronend without token
            // Call service
            console.log('burnAsset: ' + JSON.stringify(transactionIdRequest));
            return this.bigChainService.burnAsset(transactionIdRequest).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    divideAsset(req: Request, res: Response) {
        // Set data
        const transactionIdRequest = new TransactionIdRequest();
        transactionIdRequest.transactionId = req.query.transactionId;
        transactionIdRequest.outputIndex = parseInt(req.query.outputIndex, 10);
        // transactionIdRequest.providerId = req.body.providerId;
        // Get authentication token
        const authenticationToken: AuthorizationToken = res.locals.authorizationToken;
        if (authenticationToken) {
            return this.identityService.getIdentityByUserId(authenticationToken.userId).pipe(flatMap((identity) => {
                // Set identity
                transactionIdRequest.identity = identity;
                transactionIdRequest.providerId = authenticationToken.providerId;
                // Call service
                console.log('divideAsset: ' + JSON.stringify(transactionIdRequest));
                return this.bigChainService.divideAsset(transactionIdRequest, req.body.divideContent);
            })).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        } else {
            // Hard code for test fronend without token
            transactionIdRequest.identity = this.IDENTITY;
            transactionIdRequest.providerId = this.providerId;
            // Hard code for test fronend without token
            // Call service
            console.log('divideAsset: ' + JSON.stringify(transactionIdRequest));
            return this.bigChainService.divideAsset(transactionIdRequest, req.body.divideContent).subscribe(
                resData => this.handleResponse(res, resData),
                err => this.handleError(res, err)
            );
        }
    }

    private handleError(res: Response, error: Error) {
        if (error instanceof ClientError) {
            res.status(400).end('The Client Error: ' + error);
        } else {
            console.error(error.stack);
            res.status(500).end('The Internal Server Error: ' + error.message);
        }
    }

    private handleResponse(res: Response, resData) {
        switch (resData) {
            case StatusCode.Success: {
                res.status(200).end('Success');
                break;
            }
            case StatusCode.Forbidden: {
                res.status(403).end('Forbidden');
                break;
            }
            case StatusCode.InvalidDestination: {
                res.status(404).end('InvalidDestination');
                break;
            }
            case StatusCode.Error: {
                res.status(400).end('Error');
                break;
            }
            default: {
                res.status(200).json(resData).end();
                break;
            }
        }
    }

}

class ClientError extends Error {
    constructor(message: string) {
        super(message);
    }
}

