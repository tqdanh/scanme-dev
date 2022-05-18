import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {GetItemModel} from '../../model/GetItemModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Item} from '../../model/Item';
import {Products} from '../../model/Products';
import {ProductsByOrgId} from '../../model/ProductsByOrgId';
import {ItemRepository} from '../../repository/ItemRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {ItemService} from '../ItemService';
import {ProductsService} from '../ProductsService';

export class ItemServiceImpl extends DefaultGenericService<Item> implements ItemService {

    constructor(itemRepository: ItemRepository) {
        super(itemRepository);
        this.itemRepository = itemRepository;
    }

    itemRepository: ItemRepository;

    getItem(getItemModel: GetItemModel, productCatId: string): Observable<SearchResult<Item>> {
        return this.itemRepository.findItem(getItemModel, productCatId);
    }
    getItemById(itemId: string): Observable<Item> {
        return this.itemRepository.findById(itemId);
    }

    getItemByProductCatId(productCatId: string): Observable<Item[]> {
        return this.itemRepository.findByProductCatId(productCatId);
    }

    updateActionCodeItem(obj: any, itemId: string): Observable<any> {
        return this.itemRepository.updateActionCodeItem(obj, itemId);
    }

}
