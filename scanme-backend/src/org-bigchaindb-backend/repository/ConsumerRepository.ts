import {Observable} from 'rxjs';
import {SearchResult} from '../../common/model/SearchResult';
import {GenericRepository} from '../../common/repository/GenericRepository';
import {Consumer} from '../model/Consumer';
import {GetConsumerModel} from '../model/GetConsumerModel';
import {GetItemModel} from '../model/GetItemModel';
import {Item} from '../model/Item';

export interface ConsumerRepository extends GenericRepository<Consumer>  {
  findConsumer(getConsumerModel: GetConsumerModel): Observable<SearchResult<Consumer>>;
  findById(consumerId: string): Observable<Consumer>;
  insert(consumer: Consumer): Observable<Consumer>;
}
