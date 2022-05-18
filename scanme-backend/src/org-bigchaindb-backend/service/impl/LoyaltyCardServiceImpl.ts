import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {GetItemModel} from '../../model/GetItemModel';
import {GetLoyaltyCardModel} from '../../model/GetLoyaltyCardModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Item} from '../../model/Item';
import {LoyaltyCard} from '../../model/LoyaltyCard';
import {Products} from '../../model/Products';
import {ProductsByOrgId} from '../../model/ProductsByOrgId';
import {ItemRepository} from '../../repository/ItemRepository';
import {LoyaltyCardRepository} from '../../repository/LoyaltyCardRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {ItemService} from '../ItemService';
import {LoyaltyCardService} from '../LoyaltyCardService';
import {ProductsService} from '../ProductsService';

export class LoyaltyCardServiceImpl extends DefaultGenericService<LoyaltyCard> implements LoyaltyCardService {

    constructor(loyaltyCardRepository: LoyaltyCardRepository) {
        super(loyaltyCardRepository);
        this.loyaltyCardRepository = loyaltyCardRepository;
    }

    loyaltyCardRepository: LoyaltyCardRepository;

    getLoyaltyCardByOwnerId(getLoyaltyCardModel: GetLoyaltyCardModel, ownerId: string): Observable<SearchResult<LoyaltyCard>> {
        return this.loyaltyCardRepository.findLoyaltyCard(getLoyaltyCardModel, ownerId);
    }
    getLoyaltyCardByCardNumber(cardNumber: string): Observable<LoyaltyCard> {
        return this.loyaltyCardRepository.findByCardNumber(cardNumber);
    }

    getLoyaltyCardByOrgId(orgId: string): Observable<LoyaltyCard[]> {
        return this.loyaltyCardRepository.findByOrgId(orgId);
    }

    getLoyaltyCardByOwnerIdMobile(ownerId: string): Observable<LoyaltyCard[]> {
        return this.loyaltyCardRepository.findByOwnerId(ownerId);
    }

    updateLoyaltyCard(obj: any, loyaltyCardId: string): Observable<any> {
        return this.loyaltyCardRepository.updateLoyaltyCard(obj, loyaltyCardId);
    }

    existLoyaltyCard(ownerId: string, orgId: string): Observable<LoyaltyCard> {
        return this.loyaltyCardRepository.existLoyaltyCard(ownerId, orgId);
    }

    getConsumerByOrgId(orgId: string): Observable<any> {
        return this.loyaltyCardRepository.findConsumerByOrgId(orgId);
    }

}
