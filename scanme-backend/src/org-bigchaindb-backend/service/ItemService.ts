import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {GetItemModel} from '../model/GetItemModel';
import {Item} from '../model/Item';

export interface ItemService extends DefaultGenericService<Item> {
    getItem(getItemModel: GetItemModel, productCatId: string): Observable<SearchResult<Item>>;
    getItemById(itemId: string): Observable<Item>;
    getItemByProductCatId(productCatId: string): Observable<Item[]>;
    insert(item: Item): Observable<ResultInfo<Item>>;
    insertObjects(item: Item[]): Observable<number>;
    deleteByIds(ids: any): Observable<number>;
    updateObjects(item: Item[]): Observable<number>;
    updateActionCodeItem(obj: any, itemId: string): Observable<any>;
}
