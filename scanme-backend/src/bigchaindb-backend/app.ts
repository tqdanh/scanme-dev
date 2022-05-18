import * as driver from 'bigchaindb-driver';
import {Bc, BigChainClient} from 'bigchaindb-driver';
import {Db, MongoClient} from 'mongodb';
import * as redis from 'redis';
import {Observable, of, zip} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {logger} from '../common/logging/logger';
import {BaseApp} from '../web-core';
import {BigChainDBBackEndRoutes} from './BigChainDBBackEndRoutes';

export class App extends BaseApp {

    bigChainDBBackEndRoutes: BigChainDBBackEndRoutes;

    constructor(
        bigchainConfig,
        mongoUrl: string,
        database: string,
        poolSize: number,
        redisUrl: string,
        blacklistTokenKeyPrefix: string,
        tokenSecret: string,
        tokenExpires: number) {
        super();
        zip(
            this.bigChainSetup(bigchainConfig.API_PATH, bigchainConfig.APP_ID, bigchainConfig.APP_KEY),
            this.mongoSetup(mongoUrl, database, poolSize),
            this.redisSetup(redisUrl)
        ).subscribe(([bigchaindb, mongodb, redisClient]) => {
            this.initRoutes(
                bigchaindb,
                mongodb,
                redisClient,
                blacklistTokenKeyPrefix,
                tokenSecret,
                tokenExpires
            );
        }, err => console.error(err));
    }

    protected bigChainSetup(bigchainUrl: string, bigchainAppId: string, bigchainAppKey: string): Observable<Bc> {
        return fromPromise(this.createBigChainConnection(bigchainUrl, bigchainAppId, bigchainAppKey));
    }

    protected createBigChainConnection(uri: string, appId: string, appKey: string): Promise<Bc> {
        return new Promise<Db>((resolve, reject) => {
            // BigChainClient.connect(uri, {app_id: appId, app_key: appKey}, (err, client: BigChainClient) => {
            try {
                // Not yet using app_id and app_key
                const conn = new driver.Connection(uri);
                // BigChainClient.Conn.Connection(uri, {app_id: null, app_key: null}, (err, client: BigChainClient) => {
                logger.info('Connected successfully to BigChain server');
                // const conn: Bc = client;
                resolve(conn);
            } catch (err) {
                logger.info(err);
                reject(new Error(err));
            }
        });
    }

    protected mongoSetup(mongoUrl: string, database: string, poolSize: number): Observable<Db> {
        return fromPromise(this.createConnection(mongoUrl, database, 'admin', poolSize));
    }

    protected createConnection(uri: string, dbName: string, authSource = 'admin', poolSize = 5): Promise<Db> {
        return new Promise<Db>((resolve, reject) => {
            MongoClient.connect(uri, {useNewUrlParser: true, authSource, poolSize}, (err, client: MongoClient) => {
                /* istanbul ignore if */
                if (err) {
                    reject(err);
                } else {
                    logger.info('Connected successfully to MongoDB server');
                    const db: Db = client.db(dbName);
                    resolve(db);
                }
            });
        });
    }

    protected redisSetup(url: string): Observable<redis.RedisClient> {
        const redisClient = redis.createClient(url);
        redisClient.on('ready', function () {
            logger.info('Connected successfully to Redis server');
        });
        redisClient.on('error', function (error) {
            console.warn(error.message);
        });

        return of(redisClient);
    }

    protected initRoutes(bigchainDb: Bc, mongoDb: Db, redisClient: redis.RedisClient, blacklistTokenKeyPrefix: string, tokenSecret: string, tokenExpires: number) {
        this.bigChainDBBackEndRoutes = new BigChainDBBackEndRoutes(bigchainDb, mongoDb, redisClient, blacklistTokenKeyPrefix, tokenSecret, tokenExpires);
        this.bigChainDBBackEndRoutes.routes(this.app);
    }
}
