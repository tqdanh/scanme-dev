import {Db} from 'mongodb';
import {Observable} from 'rxjs';

import {Model} from '../../metadata/Model';
import {SearchModel} from '../../model/SearchModel';
import {SearchResult} from '../../model/SearchResult';
import {GenericSearchRepository} from '../GenericSearchRepository';
import {SortBuilder} from '../SortBuilder';
import {MongoGenericRepository} from './MongoGenericRepository';
import {MongoQueryBuilder} from './MongoQueryBuilder';
import {MongoSearchResultBuilder} from './MongoSearchResultBuilder';

export class MongoGenericSearchRepository<T, S extends SearchModel> extends MongoGenericRepository<T> implements GenericSearchRepository<T, SearchModel> {
  constructor(db: Db, model: Model, protected mongoQueryBuilder: MongoQueryBuilder<S>, protected sortBuilder: SortBuilder<S>, protected mongoSearchResultBuilder: MongoSearchResultBuilder) {
    super(db, model);
  }

  search(s: S): Observable<SearchResult<T>> {
    const idName = this.getIdName();
    const query = this.mongoQueryBuilder.buildQuery(s, this.model);
    const sort = this.sortBuilder.buildSort(s);
    return this.mongoSearchResultBuilder.build(this.getCollection(), query, sort, s.pageIndex, s.pageSize, idName, this.getMetaData());
  }
}
