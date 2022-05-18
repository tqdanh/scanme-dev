import {Observable, of} from 'rxjs';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {GetProductsModel} from '../../model/GetProductsModel';
import {LocationProducts} from '../../model/LocationProducts';
import {Products} from '../../model/Products';
import {LocationProductsRepository} from '../../repository/LocationProductsRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {LocationProductsService} from '../LocationProductsService';
import {ProductsService} from '../ProductsService';

export class LocationProductsServiceImpl extends DefaultGenericService<LocationProducts> implements LocationProductsService {

    locationProductRepository: LocationProductsRepository;

    constructor(locationProductRepository: LocationProductsRepository) {
        super(locationProductRepository);
        this.locationProductRepository = locationProductRepository;
    }

    getLocationProductsByOrgId(orgId: string, startDate: string, endDate: string): Observable<LocationProducts[]> {
        return this.locationProductRepository.getLocationProductsByOrgId(orgId, startDate, endDate);
    }
    getLocationProductById(id: string): Observable<LocationProducts> {
        return this.locationProductRepository.findById(id);
    }

    getLocationProductsByTxId(transactionId: string): Observable<number> {
        return this.locationProductRepository.findByTxId(transactionId);
    }
}
