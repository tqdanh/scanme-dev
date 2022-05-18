import {GenericSearchService} from '../../common/service/GenericSearchService';
import {Observable} from 'rxjs';
import {ItemModel} from '../model/ItemModel';
import {ItemSM} from '../search-model/ItemSM';

export interface ItemService extends GenericSearchService<ItemModel, ItemSM> {
    getSearchItem(itemSM: ItemSM, productCatId: string): Observable<any>;
    deleteItems(itemIds: string[]): Observable<any>;
    insertItems(items: ItemModel[]): Observable<any>;
    getItemByProductId(): Observable<any>;
    updateItems(items: any): Observable<any>;
    getSearchTxIdByItemId(productIds: string[]): Observable<any>;
    getSearchItemIdByTxId(transactionIds: string[]): Observable<any>;
}
