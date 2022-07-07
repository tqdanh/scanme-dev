import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {MessageFactory} from '../../../common/message-factory/MessageFactory';
import {ResultInfo} from '../../../common/model/ResultInfo';
import {SearchResult} from '../../../common/model/SearchResult';
import {StatusCode} from '../../../common/model/StatusCode';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {MongoUtil} from '../../../common/util/MongoUtil';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Products} from '../../model/Products';
import {ProductsByOrgId} from '../../model/ProductsByOrgId';
import {ItemRepository} from '../../repository/ItemRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {ProductsService} from '../ProductsService';

export class ProductsServiceImpl extends DefaultGenericService<Products> implements ProductsService {

    constructor(productRepository: ProductsRepository) {
        super(productRepository);
        this.productRepository = productRepository;
    }

    productRepository: ProductsRepository;

    getProducts(getProductsModel: GetProductsModel, orgId: string): Observable<SearchResult<Products>> {
        return this.productRepository.findProducts(getProductsModel, orgId);
    }
    getProductById(productId: string): Observable<Products> {
        return this.productRepository.findById(productId);
    }

    getProductByOrgId(orgId: string): Observable<ProductsByOrgId[]> {
        return this.productRepository.findByOrgId(orgId).pipe(flatMap( products => {
            const listProductByOrgId = [];
            products.forEach(elem => {
                const productsByOrgId = new ProductsByOrgId();
                productsByOrgId.productId = elem.productId;
                productsByOrgId.productName = elem.name;
                productsByOrgId.organizationId = elem.organizationId;
                productsByOrgId.status = elem.status;
                listProductByOrgId.push(productsByOrgId);
            });
            return of(listProductByOrgId);
        }));
    }

    insertList(products: Products[]): Observable<Products[]> {
        return  this.productRepository.insertList(products).pipe(flatMap( 
            products => {
                const listProduct = [];
                products.forEach(elem => {
                    const product = new Products();
                    product.productId = elem.productId;
                    product.name = elem.name;
                    product.organizationId = elem.organizationId;
                    product.status = elem.status;
                    listProduct.push(products);
                });
                return of(listProduct);
            }
        ));
        
    }

    delete(productId: string): Observable<ResultInfo<Products>> {
        return this.productRepository.countItemByProductId(productId).pipe(flatMap( count => {
            if (count > 0) {
                const result = new ResultInfo<Products>();
                result.errors = [MessageFactory.getSystemError()];
                result.status = StatusCode.SystemError;
                return of(result);
            } else {
                return super.delete(productId);
            }
        }));
    }
}
