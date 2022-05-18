import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {SearchService} from '../service/SearchService';
import {BaseSearchComponent} from './BaseSearchComponent';
import {HistoryProps} from './HistoryProps';
import {SearchPermissionBuilder} from './SearchPermissionBuilder';
import {SearchState} from './SearchState';

export class SearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T> & any> extends BaseSearchComponent<T, S, W, I & any> {
  constructor(props, protected service: SearchService<T, S>, searchPermissionBuilder: SearchPermissionBuilder , autoSearch: boolean = true, listFormId: string = null) {
    super(props, autoSearch, listFormId, searchPermissionBuilder);
  }
  search(s: S) {
    this.service.search(s).subscribe(
      (sr: SearchResult<T>) => this.showResults(s, sr),
      err => this.searchError(err)
    );
  }
}
