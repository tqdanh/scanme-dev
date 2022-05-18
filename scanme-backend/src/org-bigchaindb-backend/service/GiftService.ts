import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {GetGiftModel} from '../model/GetGiftModel';
import {GetItemModel} from '../model/GetItemModel';
import {Gift} from '../model/Gift';
import {Item} from '../model/Item';
import {ProductsByOrgId} from '../model/ProductsByOrgId';

export interface GiftService extends DefaultGenericService<Gift> {
    getGift(getGiftModel: GetGiftModel, orgId: string): Observable<SearchResult<Gift>>;
    getGiftById(giftId: string): Observable<Gift>;
    getGiftByOrgId(orgId: string): Observable<Gift[]>;
    insert(gift: Gift): Observable<ResultInfo<Gift>>;
}
