import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '../../metadata/Model';
import {SearchModel} from '../../model/SearchModel';
import {SearchResult} from '../../model/SearchResult';
import {JsonUtil} from '../../util/JsonUtil';
import {SearchUtil} from '../../util/SearchUtil';
import {UIUtil} from '../../util/UIUtil';
import {WebClientUtil} from '../../util/WebClientUtil';
import {SearchService} from '../SearchService';
import {GenericWebService} from './GenericWebService';

export class GenericSearchWebService<T, S extends SearchModel> extends GenericWebService<T> implements SearchService<T, S> {
  constructor(serviceUrl: string, model: Model) {
    super(serviceUrl, model);
  }

  protected formatSearch(s: any) {

  }

  search(s: S): Observable<SearchResult<T>> {
    this.formatSearch(s);
    JsonUtil.serializeDate(s);
    const keys = Object.keys(s);
    const s2 = SearchUtil.optimizeSearchModel(s);
    const keys2 = Object.keys(s2);
    if (keys2.length === 0) {
      const searchUrl = this.serviceUrl + '/search';
      return WebClientUtil.get(searchUrl)
        .pipe(map((res: any) => this.buildSearchResult(res)));
    } else {
      const params = UIUtil.param(s2);
      const searchUrl = this.serviceUrl + '/search' + '?' + params;
      if (searchUrl.length <= 1) {
        return WebClientUtil.get(searchUrl)
          .pipe(map((res: any) => this.buildSearchResult(res)));
      } else {
        const postSearchUrl = this.serviceUrl + '/search';
        return WebClientUtil.postRequest(postSearchUrl, s2)
          .pipe(map((res: any) => {
            return this.buildSearchResult(res);
          }));
      }
    }
  }

  protected buildSearchResult(r: SearchResult<T>): SearchResult<T> {
    if (r != null && r.results != null && r.results.length > 0) {
      this.formatObjects(r.results);
    }
    return r;
  }
}
