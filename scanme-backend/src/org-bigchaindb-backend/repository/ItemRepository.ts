import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {GetItemModel} from '../model/GetItemModel';
import {Item} from '../model/Item';

export interface ItemRepository extends GenericRepository<Item>  {
  findItem(getItemModel: GetItemModel, productCatId: string): Observable<SearchResult<Item>>;
  findById(itemId: string): Observable<Item>;
  findByProductCatId(productCatId: string): Observable<Item[]>;
  insert(item: Item): Observable<Item>;
  updateActionCodeItem(obj: any, itemId: string): Observable<any>;
}
