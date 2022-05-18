import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {SearchResult} from '../../../common/model/SearchResult';
import {DefaultGenericService} from '../../../common/service/impl/DefaultGenericService';
import {Consumer} from '../../model/Consumer';
import {GetConsumerModel} from '../../model/GetConsumerModel';
import {GetItemModel} from '../../model/GetItemModel';
import {GetProductsModel} from '../../model/GetProductsModel';
import {Item} from '../../model/Item';
import {Products} from '../../model/Products';
import {ProductsByOrgId} from '../../model/ProductsByOrgId';
import {ConsumerRepository} from '../../repository/ConsumerRepository';
import {ItemRepository} from '../../repository/ItemRepository';
import {ProductsRepository} from '../../repository/ProductsRepository';
import {ConsumerService} from '../ConsumerService';
import {ItemService} from '../ItemService';
import {ProductsService} from '../ProductsService';

export class ConsumerServiceImpl extends DefaultGenericService<Consumer> implements ConsumerService {

    constructor(consumerRepository: ConsumerRepository) {
        super(consumerRepository);
        this.consumerRepository = consumerRepository;
    }

    consumerRepository: ConsumerRepository;

    getConsumer(getConsumerModel: GetConsumerModel): Observable<SearchResult<Consumer>> {
        return this.consumerRepository.findConsumer(getConsumerModel);
    }
    getConsumerById(consumerId: string): Observable<Consumer> {
        return this.consumerRepository.findById(consumerId);
    }
}
