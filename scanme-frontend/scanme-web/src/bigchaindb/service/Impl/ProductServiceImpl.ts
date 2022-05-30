import {ProductService} from '../ProductService';
import config from '../../../config';
import {ProductSM} from '../../search-model/ProductSM';
import {Observable, of} from 'rxjs';
import {WebClientUtil} from '../../../common/util/WebClientUtil';
import {catchError} from 'rxjs/operators';
import {StatusCode} from '../../model/StatusCode';

export class ProductServiceImpl implements ProductService {
    private originUrl = `${config.productServiceUrl}/`;

    getSearchProduct(s: ProductSM, orgId: string, status: string = '0'): Observable<any> {
        const searchModel = Object.assign(s, {orgId, status});
        let url = `${this.originUrl}getProducts`;
        const keys = Object.keys(searchModel);
        const params = [];
        keys.map((key) => {
            if (searchModel[key] !== null && searchModel[key] !== undefined && searchModel[key] !== '') {
                params.push(key);
            }
            return params;
        });
        if (params.length > 0) {
            params.map((param, index) => {
                if (index === 0) { return url += `?${param}=` + searchModel[param]; }
                return url += `&${param}=` + searchModel[param];
            });
        }
        return WebClientUtil.getObject(url).pipe(catchError(error => of(`error`)));
    }
    deleteProduct(productID: string): Observable<any> {
        const url = `${this.originUrl}product/${productID}`;
        return WebClientUtil.deleteObject<StatusCode>(url).pipe(catchError(error => of(`error`)));
    }
    insertProduct(model: any): Observable<any> {
        const url = `${this.originUrl}product`;
        return WebClientUtil.postObject<StatusCode>(url, model).pipe(catchError(error => of(`error`)));
    }
    uploadImg(image: any, imageName: string, storePath: string): Observable<any> {
        const url = `${config.imageURL}/uploadImage`;
        const body = new FormData();
        body.append('file', image);
        body.set('name', imageName);
        body.set('path', storePath);
        return WebClientUtil.postObjectImage<StatusCode>(url, body).pipe(catchError(error => of(`error`)));
    }
    getProduct(productId: string): Observable<any> {
        const url = `${this.originUrl}getProductById?id=${productId}`;
        return WebClientUtil.getObject<StatusCode>(url).pipe(catchError(error => of(`error`)));
    }
    updateProduct(model: any): Observable<any> {
        const url = `${this.originUrl}product/${model._id}`;
        return WebClientUtil.putObject<StatusCode>(url, model).pipe(catchError(error => of(`error`)));
    }
}

