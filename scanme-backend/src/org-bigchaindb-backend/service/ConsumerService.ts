import {Observable} from 'rxjs';
import {ResultInfo} from '../../common/model/ResultInfo';
import {SearchResult} from '../../common/model/SearchResult';
import {DefaultGenericService} from '../../common/service/impl/DefaultGenericService';
import {Consumer} from '../model/Consumer';
import {GetConsumerModel} from '../model/GetConsumerModel';
import {GetItemModel} from '../model/GetItemModel';
import {Item} from '../model/Item';
import {ProductsByOrgId} from '../model/ProductsByOrgId';

export interface ConsumerService extends DefaultGenericService<Consumer> {
    getConsumer(getConsumerModel: GetConsumerModel): Observable<SearchResult<Consumer>>;
    getConsumerById(consumerId: string): Observable<Consumer>;
    insert(item: Consumer): Observable<ResultInfo<Consumer>>;
}
