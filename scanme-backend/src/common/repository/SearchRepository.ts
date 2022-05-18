import {Observable} from 'rxjs';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {BaseRepository} from './BaseRepository';

export interface SearchRepository<T, S extends SearchModel> extends BaseRepository {
  search(s: S): Observable<SearchResult<T>>;
}
