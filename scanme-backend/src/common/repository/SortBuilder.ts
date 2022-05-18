import {SearchModel} from '../model/SearchModel';

export interface SortBuilder<S extends SearchModel> {
  buildSort(s: S): any;
}
