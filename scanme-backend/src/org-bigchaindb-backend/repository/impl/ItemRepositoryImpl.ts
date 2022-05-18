import {Db} from 'mongodb';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {itemModel} from '../../metadata/ItemModel';
import {productsModel} from '../../metadata/ProductModel';
import {GetItemModel} from '../../model/GetItemModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Item} from '../../model/Item';
import {LoyaltyCard} from '../../model/LoyaltyCard';
import {Products} from '../../model/Products';
import {ItemRepository} from '../ItemRepository';
import {ProductsRepository} from '../ProductsRepository';

export class ItemRepositoryImpl extends MongoGenericRepository<Item> implements ItemRepository {
    constructor(db: Db) {
        super(db, itemModel);
    }

    findItem(getItemModel: GetItemModel, productCatId: string): Observable<SearchResult<Item>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<Item>();
        const query = {};
        query['$and'] = [];
        query['$and'].push({productCatId: productCatId});
        if (getItemModel.mfg) {
            query['$and'].push({mfg: getItemModel.mfg});
        }
        if (getItemModel.exp) {
            query['$and'].push({exp: getItemModel.exp});
        }
        if (getItemModel.lot) {
            query['$and'].push({lot: getItemModel.lot});
        }
        if (getItemModel._id) {
            query['$and'].push({_id: getItemModel._id});
        }
        if (getItemModel.actionCode >= 0) {
            query['$and'].push({actionCode: getItemModel.actionCode});
        }
        let sort = null;
        if (getItemModel.sortField && getItemModel.sortType && (getItemModel.sortType === 'ASC' || getItemModel.sortType === 'DESC')) {
            sort = {
                [getItemModel.sortField]: getItemModel.sortType === 'ASC' ? 1 : -1
            };
        }
        return MongoUtil.rxFind<Item>(collection, query, sort, getItemModel.pageSize, (getItemModel.pageIndex - 1) * getItemModel.pageSize).pipe(flatMap(result => {
            const result1: Item[]  = result;
            searchResult.itemTotal = result.length;
            searchResult.results = result;
            return of(searchResult);
        }));
    }

    findById(itemId: string): Observable<Item> {
        const idName = this.getIdName();
        const query = {
            _id: itemId
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByProductCatId(productCatId: string): Observable<Item[]> {
        const idName = this.getIdName();
        const query = {
            productCatId: productCatId
        };
        return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
    }

    updateActionCodeItem(obj: any, itemId: string): Observable<any> {
        const query = {
            _id: itemId
        };
        // get item
        return MongoUtil.rxFindOne<Item>(this.getCollection(), query).pipe(flatMap(result => {
            // Update point
            result.actionCode = obj.actionCode;
            return MongoUtil.rxPatch(this.getCollection(), result);
        }));
    }
}
