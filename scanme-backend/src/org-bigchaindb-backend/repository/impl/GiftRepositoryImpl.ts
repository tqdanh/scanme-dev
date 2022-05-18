import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {giftModel} from '../../metadata/GiftModel';
import {itemModel} from '../../metadata/ItemModel';
import {productsModel} from '../../metadata/ProductModel';
import {GetGiftModel} from '../../model/GetGiftModel';
import {GetItemModel} from '../../model/GetItemModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Gift} from '../../model/Gift';
import {Item} from '../../model/Item';
import {Products} from '../../model/Products';
import {GiftRepository} from '../GiftRepository';
import {ItemRepository} from '../ItemRepository';
import {ProductsRepository} from '../ProductsRepository';

export class GiftRepositoryImpl extends MongoGenericRepository<Gift> implements GiftRepository {
    constructor(db: Db) {
        super(db, giftModel);
    }

    findGift(getGiftModel: GetGiftModel, orgId: string): Observable<SearchResult<Gift>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<Gift>();
        const query = {};
        query['$and'] = [];
        query['$and'].push({orgId: orgId});
        if (getGiftModel.name) {
            query['$and'].push({name: getGiftModel.name});
        }
        if (getGiftModel.expiryDate) {
            query['$and'].push({expiryDate: {$gte : new Date(getGiftModel.expiryDate)}});
        }
        if (getGiftModel._id) {
            query['$and'].push({_id: getGiftModel._id});
        }
        let sort = null;
        if (getGiftModel.sortField && getGiftModel.sortType && (getGiftModel.sortType === 'ASC' || getGiftModel.sortType === 'DESC')) {
            sort = {
                [getGiftModel.sortField]: getGiftModel.sortType === 'ASC' ? 1 : -1
            };
        }
        return MongoUtil.rxFind<Gift>(collection, query, sort, getGiftModel.pageSize, (getGiftModel.pageIndex - 1) * getGiftModel.pageSize).pipe(flatMap(result => {
            const result1: Gift[]  = result;
            searchResult.itemTotal = result.length;
            searchResult.results = result;
            return of(searchResult);
        }));
    }

    findById(giftId: string): Observable<Gift> {
        const idName = this.getIdName();
        const query = {
            _id: giftId
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByOrgId(orgId: string): Observable<Gift[]> {
        // const idName = this.getIdName();
        // const query = {
        //     orgId: orgId
        // };
        // return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
        return this.lookupGiftByOrgId(orgId).pipe(flatMap(result => {
            return of(result);
        }));
    }

    private lookupGiftByOrgId(orgId: string): Observable<any> {
        const query = {
            orgId: orgId
        };
        // const collection = this.db.collection('user');
        const collection = this.getCollection();
        return MongoUtil.rxFindWithAggregate(collection, [
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'organization',
                    localField: 'orgId',
                    foreignField: '_id',
                    as: 'organization'
                }
            },
            {
                $unwind: '$organization'
            },
            {
                $project: {
                    name: '$name',
                    image: '$image',
                    // expirydate: {'$dayOfWeek': '$expiryDate'},
                    expirydate: {'$concat': [{'$substr': [{'$year': '$expiryDate'}, 0, 4]}, '-', {'$substr': [{'$month': '$expiryDate'}, 0, 2]}, '-', {'$substr': [{'$dayOfMonth': '$expiryDate'}, 0, 2]}]},
                    quantity: '$quantity',
                    point: '$point',
                    company: {
                        id: '$organization._id',
                        name: '$organization.organizationName',
                        logo: '$organization.imageUrl',
                        address: '$organization.organizationAddress',
                        tel: '$organization.organizationPhone',
                        email: '$organization.email'
                    }
                }
            }
        ]).pipe(flatMap(result => {
            if (result.length === 0) {
                return of({});
            }
            return of(result);
        }));
    }

}
