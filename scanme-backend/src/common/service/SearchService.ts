import {Observable} from 'rxjs';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {BaseService} from './BaseService';

export interface SearchService<T, S extends SearchModel> extends BaseService {
    search(s: SearchModel): Observable<SearchResult<T>>;
}
