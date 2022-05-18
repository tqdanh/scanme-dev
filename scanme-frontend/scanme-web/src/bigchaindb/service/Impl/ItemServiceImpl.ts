import config from '../../../config';
import {ItemService} from '../ItemService';
import {Observable, of} from 'rxjs';
import {WebClientUtil} from '../../../common/util/WebClientUtil';
import {StatusCode} from '../../model/StatusCode';
import {catchError} from 'rxjs/operators';
import {ItemSM} from '../../search-model/ItemSM';
import {ItemModel} from '../../model/ItemModel';

export class ItemServiceImpl implements ItemService {
    private originUrl = `${config.itemServiceUrl}/`;

    deleteItems(itemIds: string[]): Observable<any> {
        const url = `${this.originUrl}items`;
        return WebClientUtil.deleteObject<StatusCode>(url, itemIds).pipe(catchError(error => of(`error`)));
    }

    getItemByProductId(): Observable<any> {
        return undefined;
    }

    getSearchItem(itemSM: ItemSM, productCatId: string): Observable<any> {
        const searchModel = Object.assign(itemSM, {productCatId});
        let url = `${this.originUrl}getItem`;
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
        return WebClientUtil.getObject<StatusCode>(url).pipe(catchError(error => of(`error`)));
    }

    insertItems(items: ItemModel[]): Observable<any> {
        const url = `${this.originUrl}items`;
        return WebClientUtil.postObject<StatusCode>(url, items).pipe(catchError(error => of(`error`)));
    }

    updateItems(items: any): Observable<any> {
        const url = `${this.originUrl}items`;
        return WebClientUtil.putObject<StatusCode>(url, items).pipe(catchError(error => of(`error`)));
    }
    getSearchTxIdByItemId(productIds: string[]): Observable<any> {
        const url = `${this.originUrl}getSearchTxIdByItemId`;
        return WebClientUtil.putObject<StatusCode>(url, productIds).pipe(catchError(error => of(`error`)));
    }
    getSearchItemIdByTxId(transactionIds: string[]): Observable<any> {
        const url = `${this.originUrl}getSearchItemIdByTxId`;
        return WebClientUtil.putObject<StatusCode>(url, transactionIds).pipe(catchError(error => of(`error`)));
    }
}


