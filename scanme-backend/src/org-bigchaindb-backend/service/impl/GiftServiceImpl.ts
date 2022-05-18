import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {GetGiftModel} from '../../model/GetGiftModel';
import {GetItemModel} from '../../model/GetItemModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Gift} from '../../model/Gift';
import {Item} from '../../model/Item';
import {Products} from '../../model/Products';
import {ProductsByOrgId} from '../../model/ProductsByOrgId';
import {GiftRepository} from '../../repository/GiftRepository';
import {ItemRepository} from '../../repository/ItemRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {GiftService} from '../GiftService';
import {ItemService} from '../ItemService';
import {ProductsService} from '../ProductsService';

export class GiftServiceImpl extends DefaultGenericService<Gift> implements GiftService {

    constructor(giftRepository: GiftRepository) {
        super(giftRepository);
        this.giftRepository = giftRepository;
    }

    giftRepository: GiftRepository;

    getGift(getGiftModel: GetGiftModel, orgId: string): Observable<SearchResult<Gift>> {
        return this.giftRepository.findGift(getGiftModel, orgId);
    }
    getGiftById(giftId: string): Observable<Gift> {
        return this.giftRepository.findById(giftId);
    }

    getGiftByOrgId(orgId: string): Observable<Gift[]> {
        return this.giftRepository.findByOrgId(orgId);
    }
}
