import {SearchModel} from '../model/SearchModel';
import {GenericRepository} from './GenericRepository';
import {SearchRepository} from './SearchRepository';

export interface GenericSearchRepository<T, S extends SearchModel>
  extends GenericRepository<T>, SearchRepository<T, S> {
}
