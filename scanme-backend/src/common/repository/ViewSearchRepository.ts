import {SearchModel} from '../model/SearchModel';
import {SearchRepository} from './SearchRepository';
import {ViewRepository} from './ViewRepository';

export interface ViewSearchRepository<T, S extends SearchModel>
  extends ViewRepository<T>, SearchRepository<T, S> {
}
