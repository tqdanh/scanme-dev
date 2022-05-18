import {SearchModel} from '../model/SearchModel';
import {GenericService} from './GenericService';
import {SearchService} from './SearchService';

export interface GenericSearchService<T, S extends SearchModel>
  extends GenericService<T>, SearchService<T, S> {
}
