import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {GetGiftModel} from '../model/GetGiftModel';
import {GetItemModel} from '../model/GetItemModel';
import {Gift} from '../model/Gift';
import {Item} from '../model/Item';

export interface GiftRepository extends GenericRepository<Gift>  {
  findGift(getGiftModel: GetGiftModel, orgId: string): Observable<SearchResult<Gift>>;
  findById(giftId: string): Observable<Gift>;
  findByOrgId(orgId: string): Observable<Gift[]>;
  insert(gift: Gift): Observable<Gift>;
}
