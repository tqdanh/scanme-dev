import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {GetLocationProducsModel} from '../model/GetLocationProducsModel';
import {GetProductsModel} from '../model/GetProductsModel';
import {LocationProducts} from '../model/LocationProducts';
import {Products} from '../model/Products';


export interface LocationProductsRepository extends GenericRepository<LocationProducts>  {
  getLocationProductsByOrgId(orgId: string, startDate: string, endDate: string): Observable<LocationProducts[]>;
  findById(locationProductId: string): Observable<LocationProducts>;
  insert(locationProduct: LocationProducts): Observable<LocationProducts>;
  findByTxId(transactionId: string): Observable<number>;
}
