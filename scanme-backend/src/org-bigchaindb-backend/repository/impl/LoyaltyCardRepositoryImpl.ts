import {Db} from 'mongodb';
import {Observable, of, pipe} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {itemModel} from '../../metadata/ItemModel';
import {loyaltyCardModel} from '../../metadata/LoyaltyCardModel';
import {productsModel} from '../../metadata/ProductModel';
import {Consumer} from '../../model/Consumer';
import {GetItemModel} from '../../model/GetItemModel';
import {GetLoyaltyCardModel} from '../../model/GetLoyaltyCardModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Identity} from '../../model/Identity';
import {Item} from '../../model/Item';
import {LoyaltyCard} from '../../model/LoyaltyCard';
import {Products} from '../../model/Products';
import {ItemRepository} from '../ItemRepository';
import {LoyaltyCardRepository} from '../LoyaltyCardRepository';
import {ProductsRepository} from '../ProductsRepository';

export class LoyaltyCardRepositoryImpl extends MongoGenericRepository<LoyaltyCard> implements LoyaltyCardRepository {
    constructor(db: Db) {
        super(db, loyaltyCardModel);
    }

    findLoyaltyCard(getLoyaltyCardModel: GetLoyaltyCardModel, ownerId: string): Observable<SearchResult<LoyaltyCard>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<LoyaltyCard>();
        const query = {};
        query['$and'] = [];
        query['$and'].push({ownerId: ownerId});
        if (getLoyaltyCardModel.cardNumber) {
            query['$and'].push({cardNumber: getLoyaltyCardModel.cardNumber});
        }
        if (getLoyaltyCardModel.orgId) {
            query['$and'].push({orgId: getLoyaltyCardModel.orgId});
        }
        if (getLoyaltyCardModel.type) {
            query['$and'].push({type: getLoyaltyCardModel.type});
        }
        if (getLoyaltyCardModel._id) {
            query['$and'].push({_id: getLoyaltyCardModel._id});
        }
        let sort = null;
        if (getLoyaltyCardModel.sortField && getLoyaltyCardModel.sortType && (getLoyaltyCardModel.sortType === 'ASC' || getLoyaltyCardModel.sortType === 'DESC')) {
            sort = {
                [getLoyaltyCardModel.sortField]: getLoyaltyCardModel.sortType === 'ASC' ? 1 : -1
            };
        }
        return MongoUtil.rxFind<LoyaltyCard>(collection, query, sort, getLoyaltyCardModel.pageSize, (getLoyaltyCardModel.pageIndex - 1) * getLoyaltyCardModel.pageSize).pipe(flatMap(result => {
            const result1: LoyaltyCard[]  = result;
            searchResult.itemTotal = result.length;
            searchResult.results = result;
            return of(searchResult);
        }));
    }

    findByCardNumber(cardNumber: string): Observable<LoyaltyCard> {
        const idName = this.getIdName();
        const query = {
            cardNumber: cardNumber
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByOrgId(orgId: string): Observable<LoyaltyCard[]> {
        const idName = this.getIdName();
        const query = {
            orgId: orgId
        };
        return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
    }

    findByOwnerId(ownerId: string): Observable<LoyaltyCard[]> {
        return this.lookupLoyaltyCardByOwnerId(ownerId).pipe(flatMap(result => {
            return of(result);
        }));
    }

    private lookupLoyaltyCardByOwnerId(ownerId: string): Observable<any> {
        const query = {
            ownerId: ownerId
        };
        // const collection = this.db.collection('user');
        const collection = this.getCollection();
        return MongoUtil.rxFindWithAggregate(collection, [
            {
                $match: query
            }
            , {
                $lookup: {
                    from: 'consumer',
                    localField: 'ownerId',
                    foreignField: 'userId',
                    as: 'consumer'
                }
            },
            {
                $unwind: '$consumer'
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
                    owner: '$consumer.fullName',
                    cardnumber: '$cardNumber',
                    type: '$type',
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

    updateLoyaltyCard(obj: any, loyaltyCardId: string): Observable<any> {
        // {
        //     "itemId": "5d79eec8abcc3d43300bbe9d",
        //     "scanDate": "2019-11-12",
        //     "location": ["10.840618","106.765229"]
        // }
        // ==>
        // [{
        //     "itemId": "5d79eec8abcc3d43300bbe9d",
        //     "scanDate": "2019-11-12",
        //     "location": ["10.840618","106.765229"]
        // }
        // ]
        const items = Object.assign([], obj.items); // Convert object to array
        if (!items[0]) {
            return of(null);
        }
        const itemId = items[0].itemId;
        const query = {
            _id: itemId
        };
        // get item point
        const collection = this.db.collection('item');
        return MongoUtil.rxFindOne<Item>(collection, query).pipe(flatMap(result => {
            let pointPlus = 0;
            if (result.actionCode < 3) {
                pointPlus = result.point;
            }
            // Update point
            return MongoUtil.rxFindOne<LoyaltyCard>(this.getCollection(), {_id: loyaltyCardId}).pipe(flatMap(resultCard => {
                resultCard.point = resultCard.point + pointPlus;
                return MongoUtil.rxPatch(this.getCollection(), resultCard).pipe(flatMap( res => {
                    // Add item location
                    const update = {items: {$each: items}};
                    return MongoUtil.rxUpdateFieldArray(this.getCollection(), this.mapToMongoObject(obj), update);
                }));
            }));
        }));
    }

    existLoyaltyCard(ownerId: string, orgId: string): Observable<LoyaltyCard> {
        const collection = this.getCollection();
        const query = {};
        query['$and'] = [];
        query['$and'].push({ownerId: ownerId});
        query['$and'].push({orgId: orgId});
        return MongoUtil.rxFindOne<LoyaltyCard>(collection, query).pipe(flatMap(result => {
        //    if (result) {
                return of(result);
        //    } else {
        //        const loyaltyCard = new LoyaltyCard();
        //        return of(loyaltyCard);
        //    }
        }));
    }

    findConsumerByOrgId(orgId: string): Observable<any> {
        return this.lookupConsumerByOrgId(orgId).pipe(flatMap(result => {
            return of(result);
        }));
    }

    private lookupConsumerByOrgId(orgId: string): Observable<any> {
        const query = {
            orgId: orgId
        };
        // const collection = this.db.collection('user');
        const collection = this.getCollection();
        return MongoUtil.rxFindWithAggregate(collection, [
            {
                $match: query
            }
            , {
                $lookup: {
                    from: 'consumer',
                    localField: 'ownerId',
                    foreignField: 'userId',
                    as: 'consumer'
                }
            },
            {
                $unwind: '$consumer'
            },
            {
                $project: {
                    fullname: '$consumer.fullName',
                    telephone: '$consumer.telephone',
                    idCard: '$consumer.idCard',
                    sex: '$consumer.sex',
                    birthDay: '$consumer.birthDay',
                    address: '$consumer.address',
                    email: '$consumer.email',
                    cardNumber: '$cardNumber',
                    point: '$point',
                    typeCard: '$type',
                    items: '$items'
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
