import {Collection} from 'mongodb';
import {Observable} from 'rxjs';
import {Model} from '../../metadata/Model';
import {SearchResult} from '../../model/SearchResult';

export interface MongoSearchResultBuilder {
  build<T>(collection: Collection, query: any, sort: any, pageIndex: number, pageSize: number, idName: string, model?: Model): Observable<SearchResult<T>>;
}
