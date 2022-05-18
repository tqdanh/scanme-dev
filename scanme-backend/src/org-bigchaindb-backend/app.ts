import {Db, MongoClient} from 'mongodb';
import {Observable, of, zip} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';

import {BaseApp} from '../web-core';
import {OrgBigChainDBBackEndRoutes} from './OrgBigChainDBBackEndRoutes';

export class App extends BaseApp {
    orgBigChainDBBackEndRoutes: OrgBigChainDBBackEndRoutes;

    public init(mongoUrl: string,
                database: string,
                poolSize: number,
                sendGridApiKey: string,
                fromEmail: string,
                domain: string,
                httpPort: number,
                httpsSecure: boolean,
                passcodeConfirmUserExpires: number,
                maxPasswordAge: number,
                encryptPasswordKey: string,
                blacklistTokenKeyPrefix: string,
                tokenSecret: string,
                tokenExpires: number): Observable<void> {
        return zip(
            this.mongoSetup(mongoUrl, database, poolSize)
        ).pipe(map(([mongodb]) => {
            return this.initRoutes(
                mongodb,
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
        }));
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
                    console.log('Connected successfully to MongoDB server');
                    const db: Db = client.db(dbName);
                    resolve(db);
                }
            });
        });
    }

    protected initRoutes(
        mongoDb: Db,
        sendGridApiKey: string,
        fromEmail: string,
        domain: string,
        httpPort: number,
        httpsSecure: boolean,
        passcodeConfirmUserExpires: number,
        maxPasswordAge: number,
        encryptPasswordKey: string,
        blacklistTokenKeyPrefix: string,
        tokenSecret: string,
        tokenExpires: number
    ) {
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
