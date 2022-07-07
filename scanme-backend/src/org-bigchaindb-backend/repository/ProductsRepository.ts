import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {GetProductsModel} from '../model/GetProductsModel';
import {Products} from '../model/Products';


export interface ProductsRepository extends GenericRepository<Products>  {
  findProducts(getProductsModel: GetProductsModel, orgId: string): Observable<SearchResult<Products>>;
  findById(productId: string): Observable<Products>;
  findByOrgId(orgId: string): Observable<Products[]>;
  insert(products: Products): Observable<Products>;
  insertList(products: Products[]): Observable<Products[]>;
  countItemByProductId(productId: string): Observable<number>;
}
