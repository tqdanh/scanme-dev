import {Bc, BigChainClient} from 'bigchaindb-driver';
import {Application} from 'express';
import {Db} from 'mongodb';
import {RedisClient} from 'redis';
import {RedisCacheManager} from '../common/cache/impl/RedisCacheManager';
import {AuthenticationHandler} from '../common/handler/AuthenticationHandler';
import {DefaultBlacklistTokenService} from '../common/service/DefaultBlacklistTokenService';
import {logger, requestLogger} from '../core';
import {BigChainController} from './controller/BigChainController';
import {CombineServciesController} from './controller/CombineServciesController';
import {ApplicationFactory} from './factory/ApplicationFactory';

export class BigChainDBBackEndRoutes {
    private readonly bigChainController: BigChainController;
    private readonly authHandler: AuthenticationHandler;
    private readonly combineServciesController: CombineServciesController;

    constructor(
        conn: Bc,
        db: Db,
        redisClient: RedisClient,
        blacklistTokenKeyPrefix: string,
        tokenSecret: string,
        tokenExpires: number) {
        const applicationFactory = new ApplicationFactory(conn, db, redisClient);
        this.bigChainController = applicationFactory.bigChainController;
        const rxCacheManager = new RedisCacheManager(redisClient);
        const blacklistTokenService = new DefaultBlacklistTokenService(rxCacheManager, tokenExpires, blacklistTokenKeyPrefix);
        this.authHandler = new AuthenticationHandler(blacklistTokenService, tokenSecret);
        this.combineServciesController = applicationFactory.combineServicesController;
    }

    routes(app: Application): void {
        app.use(requestLogger(logger));

        app.route('/getSearchTxIdByItemId')
            .put(this.bigChainController.getSearchTxIdByItemId.bind(this.bigChainController));

        app.route('/getSearchTxIdByItemIdInList')
            .get(this.bigChainController.getSearchTxIdByItemIdInList.bind(this.bigChainController));

        app.route('/getSearchItemIdByTxId')
            .put(this.bigChainController.getSearchItemIdByTxId.bind(this.bigChainController));

        app.route('/getHisByAssetId')
            .get(this.bigChainController.getHisByAssetId.bind(this.bigChainController));

        app.route('/getHisAssetByTransId')
            .get(this.bigChainController.getHisAssetByTransId.bind(this.bigChainController));

        app.route('/traceProduct')
            .put(this.combineServciesController.traceProduct.bind(this.combineServciesController));

        app.route('/traceSource')
            .get(this.combineServciesController.traceSource.bind(this.combineServciesController));

        app.route('/getTransaction')
            .get(this.bigChainController.getTransaction.bind(this.bigChainController));

        // app.route('/getSourcesForCreateAsset')
        //     .get(this.bigChainController.getSourcesForCreateAsset.bind(this.bigChainController));

        app.route('/getSourcesForCreateAssetToken')
            .get(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.getSourcesForCreateAsset.bind(this.bigChainController));

        // app.route('/getListOuputUnspentOfTx')
        //     .get(this.bigChainController.getListOuputUnspentOfTx.bind(this.bigChainController));

        app.route('/getListOuputUnspentOfTxToken')
            .get(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.getListOuputUnspentOfTx.bind(this.bigChainController));

        // Search assets with pagination and sort.
        // app.route('/searchAssets')
        //     .get(this.bigChainController.searchAssets.bind(this.bigChainController));

        // Search assets with pagination and sort and token.
        app.route('/searchAssetsToken')
            .get(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.searchAssets.bind(this.bigChainController));

        app.route('/createAsset')
            .post(this.bigChainController.createAsset.bind(this.bigChainController));

        // Import assets
        app.route('/importCreateAsset')
            .post(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.importCreateAsset.bind(this.bigChainController));

        app.route('/createAssetToken')
            .post(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.createAsset.bind(this.bigChainController));

        app.route('/transferAsset')
            .post(this.bigChainController.transferAsset.bind(this.bigChainController));

        app.route('/transferAssetToken')
            .post(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.transferAsset.bind(this.bigChainController));

        app.route('/appendMetaData')
            .put(this.bigChainController.appendMetaData.bind(this.bigChainController));

        app.route('/appendMetaDataToken')
            .put(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.appendMetaData.bind(this.bigChainController));

        app.route('/burnAsset')
            .delete(this.bigChainController.burnAsset.bind(this.bigChainController));

        app.route('/burnAssetToken')
            .delete(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.burnAsset.bind(this.bigChainController));

        app.route('/divideAsset')
            .put(this.bigChainController.divideAsset.bind(this.bigChainController));

        app.route('/divideAssetToken')
            .put(this.authHandler.checkToken.bind(this.authHandler), this.bigChainController.divideAsset.bind(this.bigChainController));

    }
}
