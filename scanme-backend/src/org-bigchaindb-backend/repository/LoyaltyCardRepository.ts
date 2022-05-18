import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {Consumer} from '../model/Consumer';
import {GetLoyaltyCardModel} from '../model/GetLoyaltyCardModel';
import {LoyaltyCard} from '../model/LoyaltyCard';

export interface LoyaltyCardRepository extends GenericRepository<LoyaltyCard>  {
  findLoyaltyCard(getLoyaltyCardModel: GetLoyaltyCardModel, ownerId: string): Observable<SearchResult<LoyaltyCard>>;
  findByCardNumber(cardNumber: string): Observable<LoyaltyCard>;
  findByOrgId(orgId: string): Observable<LoyaltyCard[]>;
  findConsumerByOrgId(orgId: string): Observable<any>;
  findByOwnerId(ownerId: string): Observable<LoyaltyCard[]>;
  insert(loyaltyCard: LoyaltyCard): Observable<LoyaltyCard>;
  updateLoyaltyCard(obj: any, loyaltyCardId: string): Observable<any>;
  existLoyaltyCard(ownerId: string, orgId: string): Observable<LoyaltyCard>;
}
