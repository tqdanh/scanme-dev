import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {LocationProducts} from '../model/LocationProducts';

export interface LocationProductsService extends DefaultGenericService<LocationProducts> {
    getLocationProductsByOrgId(orgId: string, startDate: string, endDate: string): Observable<LocationProducts[]>;
    getLocationProductById(orgId: string): Observable<LocationProducts>;
    insert(locationProduct: LocationProducts): Observable<ResultInfo<LocationProducts>>;
    getLocationProductsByTxId(transactionId: string): Observable<number>;
}
