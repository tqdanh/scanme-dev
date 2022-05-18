import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {GetItemModel} from '../model/GetItemModel';
import {GetLoyaltyCardModel} from '../model/GetLoyaltyCardModel';
import {Item} from '../model/Item';
import {LoyaltyCard} from '../model/LoyaltyCard';
import {ProductsByOrgId} from '../model/ProductsByOrgId';

export interface LoyaltyCardService extends DefaultGenericService<LoyaltyCard> {
    getLoyaltyCardByOwnerId(getLoyaltyCardModel: GetLoyaltyCardModel, ownerId: string): Observable<SearchResult<LoyaltyCard>>;
    getLoyaltyCardByCardNumber(cardNumber: string): Observable<LoyaltyCard>;
    getLoyaltyCardByOrgId(orgId: string): Observable<LoyaltyCard[]>;
    getConsumerByOrgId(orgId: string): Observable<any>;
    getLoyaltyCardByOwnerIdMobile(ownerId: string): Observable<LoyaltyCard[]>;
    insert(loyaltyCard: LoyaltyCard): Observable<ResultInfo<LoyaltyCard>>;
    updateLoyaltyCard(obj: any, loyaltyCardId: string): Observable<any>;
    existLoyaltyCard(ownerId: string, orgId: string): Observable<LoyaltyCard>;
}
