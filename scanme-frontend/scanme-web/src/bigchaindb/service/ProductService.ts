import {ProductModel} from '../model/ProductModel';
import {ProductSM} from '../search-model/ProductSM';
import {GenericSearchService} from '../../common/service/GenericSearchService';
import {Observable} from 'rxjs';

export interface ProductService extends GenericSearchService<ProductModel, ProductSM> {
    getSearchProduct(productSM: ProductSM, orgId: string, status: string): Observable<any>;
    deleteProduct(productID: string): Observable<any>;
    insertProduct(model: any): Observable<any>;
    uploadImg(image: any, imageName: string, storePath: string): Observable<any>;
    getProduct(productId: string): Observable<any>;
    updateProduct(model: any): Observable<any>;
}
