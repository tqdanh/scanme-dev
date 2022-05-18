import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {consumerModel} from '../../metadata/ConsumerModel';
import {Consumer} from '../../model/Consumer';
import {GetConsumerModel} from '../../model/GetConsumerModel';
import {ConsumerRepository} from '../ConsumerRepository';

export class ConsumerRepositoryImpl extends MongoGenericRepository<Consumer> implements ConsumerRepository {
    constructor(db: Db) {
        super(db, consumerModel);
    }

    findConsumer(getConsumerModel: GetConsumerModel): Observable<SearchResult<Consumer>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<Consumer>();
        const query = {};
        query['$and'] = [];
        if (getConsumerModel.fullName) {
            query['$and'].push({fullName: getConsumerModel.fullName});
        }
        if (getConsumerModel.telephone) {
            query['$and'].push({telephone: getConsumerModel.telephone});
        }
        if (getConsumerModel.idCard) {
            query['$and'].push({idCard: getConsumerModel.idCard});
        }
        if (getConsumerModel.address) {
            query['$and'].push({address: getConsumerModel.address});
        }
        if (getConsumerModel.email) {
            query['$and'].push({email: getConsumerModel.email});
        }
        if (getConsumerModel._id) {
            query['$and'].push({_id: getConsumerModel._id});
        }
        if (getConsumerModel.userId) {
            query['$and'].push({userId: getConsumerModel.userId});
        }
        if (getConsumerModel.sso) {
            query['$and'].push({sso: getConsumerModel.sso});
        }
        let sort = null;
        if (getConsumerModel.sortField && getConsumerModel.sortType && (getConsumerModel.sortType === 'ASC' || getConsumerModel.sortType === 'DESC')) {
            sort = {
                [getConsumerModel.sortField]: getConsumerModel.sortType === 'ASC' ? 1 : -1
            };
        }
        return MongoUtil.rxFind<Consumer>(collection, query, sort, getConsumerModel.pageSize, (getConsumerModel.pageIndex - 1) * getConsumerModel.pageSize).pipe(flatMap(result => {
            const result1: Consumer[]  = result;
            searchResult.itemTotal = result.length;
            searchResult.results = result;
            return of(searchResult);
        }));
    }

    findById(consumerId: string): Observable<Consumer> {
        const idName = this.getIdName();
        const query = {
            userId: consumerId
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

}
