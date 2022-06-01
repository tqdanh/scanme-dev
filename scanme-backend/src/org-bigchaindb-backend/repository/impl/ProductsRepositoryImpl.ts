import {Db} from 'mongodb';
import {forkJoin, Observable, of} from 'rxjs';
import {flatMap, map, mergeMap} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {MongoGenericRepository} from '../../../common/repository/mongo/MongoGenericRepository';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {productsModel} from '../../metadata/ProductModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Products} from '../../model/Products';
import {ProductsRepository} from '../ProductsRepository';

export class ProductsRepositoryImpl extends MongoGenericRepository<Products> implements ProductsRepository {
    constructor(db: Db) {
        super(db, productsModel);
    }

    findProducts(getProductsModel: GetProductsModel, orgId: string): Observable<SearchResult<Products>> {
        const collection = this.getCollection();
        const searchResult = new SearchResult<Products>();
        const query = {};
        query['$and'] = [];
        query['$and'].push({status: getProductsModel.status});
        query['$and'].push({organizationId: orgId});
        if (getProductsModel.name) {
            query['$and'].push({name: {'$regex': getProductsModel.name}});
        }
        if (getProductsModel._id) {
            query['$and'].push({_id: getProductsModel._id});
        }

        let sort = null;
        if (getProductsModel.sortField && getProductsModel.sortType && (getProductsModel.sortType === 'ASC' || getProductsModel.sortType === 'DESC')) {
            sort = {
                [getProductsModel.sortField]: getProductsModel.sortType === 'ASC' ? 1 : -1
            };
        }
        
        return forkJoin({
            items: MongoUtil.rxFind<Products>(collection, query, sort, getProductsModel.pageSize, (getProductsModel.pageIndex - 1) * getProductsModel.pageSize),
            totalItems: MongoUtil.rxCount(collection, query)
        })
        .pipe(mergeMap(result => {
            searchResult.results = result.items;
            searchResult.itemTotal = result.totalItems;
            return of(searchResult);
        }));
    }

    findById(productId: string): Observable<Products> {
        const idName = this.getIdName();
        const query = {
            _id: productId
        };
        return MongoUtil.rxFindOne(this.getCollection(), query).pipe(map(objs => MongoUtil.mapArray(objs, idName)));
    }

    findByOrgId(orgId: string): Observable<Products[]> {
        const idName = this.getIdName();
        const query = {
            organizationId: orgId
        };
        return MongoUtil.rxFind(this.getCollection(), query).pipe(map(obj => MongoUtil.mapArray(obj, idName)));
    }

    countItemByProductId(productId: string): Observable<number> {
        const query = {
            productCatId: productId
        };
        const collection = this.db.collection('item');
        return MongoUtil.rxCount(collection, query);
    }

}
