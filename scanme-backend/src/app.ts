import * as driver from 'bigchaindb-driver';
// @ts-ignore
import {Bc, BigChainClient} from 'bigchaindb-driver';
import {Db, MongoClient} from 'mongodb';
import * as redis from 'redis';
import {Observable, of, zip} from 'rxjs';

import {fromPromise} from 'rxjs/internal-compatibility';
// import { fromPromise } from 'rxjs/observable/fromPromise';
import {BigChainDBBackEndRoutes} from './bigchaindb-backend/BigChainDBBackEndRoutes';
import config from './config';
import {logger} from './core';
import {OrgBigChainDBBackEndRoutes} from './org-bigchaindb-backend/OrgBigChainDBBackEndRoutes';
import {BaseApp} from './web-core';

export class App extends BaseApp {
  // Define routes for Application
  bigChainDBBackEndRoutes: BigChainDBBackEndRoutes;
  orgBigChainDBBackEndRoutes: OrgBigChainDBBackEndRoutes;

  // Init application configuration parameters
  constructor(
    protected mongoUrl: string,
    protected database: string,
    protected poolSize: number,
    protected bigchainConfig,
    protected redisUrl: string,
    protected httpPort: number,
    protected httpsSecure: boolean,
    protected sendGridApiKey: string,
    protected fromEmail: string,
    protected domain: string,
    protected passcodeConfirmUserExpires: number,
    protected maxPasswordAge: number,
    protected encryptPasswordKey: string,
    protected blacklistTokenKeyPrefix: string,
    protected tokenSecret: string,
    protected tokenExpires: number
  ) {
    super();
    // Setup connection with servers
    zip(
        this.bigChainSetup(bigchainConfig.API_PATH, bigchainConfig.APP_ID, bigchainConfig.APP_KEY),
        this.mongoSetup(mongoUrl, database, poolSize),
        this.redisSetup(redisUrl)
    ).subscribe(([bigchaindb, mongodb, redisClient]) => {
      this.initRoutes(
          mongodb,
          bigchaindb,
          redisClient,
          httpPort,
          httpsSecure,
          sendGridApiKey,
          fromEmail,
          domain,
          passcodeConfirmUserExpires,
          maxPasswordAge,
          encryptPasswordKey,
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
        const conn = new driver.Connection(uri);
        // const conn = new driver.Connection([uri, { endpoint: 'http://192.168.75.230:9984/api/v1/'}]);
        // Not yet using app_id and app_key
        // const conn = new driver.Connection([uri, 'http://192.168.75.230:9984/api/v1/']);
        // BigChainClient.Conn.Connection(uri, {app_id: bigchainConfig.app_id, app_key: bigchainConfig.app_key}, (err, client: BigChainClient) => {
        logger.info('Connected successfully to BigChain server');
        // const conn: Bc = client;
        // @ts-ignore
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
    const redisClient = redis.createClient({
      url,
      password: "12341234x@@X"
    });
    redisClient.on('ready', function () {
      logger.info('Connected successfully to Redis server');
    });
    redisClient.on('error', function (error) {
      console.warn(error.message);
    });

    return of(redisClient);
  }

  protected initRoutes(
    mongoDb: Db,
    bigchainDb: Bc,
    redisClient: redis.RedisClient,
    httpPort: number,
    httpsSecure: boolean,
    sendGridApiKey: string,
    fromEmail: string,
    domain: string,
    passcodeConfirmUserExpires: number,
    maxPasswordAge: number,
    encryptPasswordKey: string,
    blacklistTokenKeyPrefix: string,
    tokenSecret: string,
    tokenExpires: number
) {
    this.bigChainDBBackEndRoutes = new BigChainDBBackEndRoutes(
        bigchainDb,
        mongoDb,
        redisClient,
        blacklistTokenKeyPrefix,
        tokenSecret,
        tokenExpires);
    this.bigChainDBBackEndRoutes.routes(this.app);
    this.orgBigChainDBBackEndRoutes = new OrgBigChainDBBackEndRoutes(
        mongoDb,
        sendGridApiKey,
        fromEmail,
        domain,
        httpPort,
        httpsSecure,
        passcodeConfirmUserExpires,
        maxPasswordAge,
        encryptPasswordKey,
        blacklistTokenKeyPrefix,
        tokenSecret,
        tokenExpires
    );
    this.orgBigChainDBBackEndRoutes.routes(this.app);
  }
}
