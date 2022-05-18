import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {GetProductsModel} from '../model/GetProductsModel';
import {Products} from '../model/Products';
import {ProductsByOrgId} from '../model/ProductsByOrgId';

export interface ProductsService extends DefaultGenericService<Products> {
    getProducts(getProductsModel: GetProductsModel, orgId: string): Observable<SearchResult<Products>>;
    getProductById(productId: string): Observable<Products>;
    getProductByOrgId(orgId: string): Observable<ProductsByOrgId[]>;
    insert(product: Products): Observable<ResultInfo<Products>>;
    delete(productId: string): Observable<ResultInfo<Products>>;
}
