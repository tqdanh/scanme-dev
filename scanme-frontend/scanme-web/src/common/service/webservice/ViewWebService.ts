import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '../../metadata/Model';
import {MetadataUtil} from '../../metadata/util/MetadataUtil';
import {WebClientUtil} from '../../util/WebClientUtil';
import {ViewService} from '../ViewService';
import {BaseWebService} from './BaseWebService';

export class ViewWebService<T> extends BaseWebService implements ViewService<T> {
  constructor(protected serviceUrl: string, protected model: Model) {
    super();
  }

  getMetaData(): Model {
    return this.model;
  }

  getAll(): Observable<T[]> {
    return WebClientUtil.get(this.serviceUrl)
      .pipe(map((res: any) => this.formatObjects(res)));
  }

  getById(id): Observable<T> {
    let url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && this.model) {
      const metaModel = MetadataUtil.getMetaModel(this.model);
      if (metaModel.primaryKeys && metaModel.primaryKeys.length > 0) {
        url = this.serviceUrl;
        for (const key of metaModel.primaryKeys) {
          url = url + '/' + id[key.name];
        }
      }
    }
    return WebClientUtil.get(url)
      .pipe(map((res: any) => this.formatObject(res)));
  }

  protected formatObjects(list: any[]): any[] {
    if (!list || list.length === 0) {
      return list;
    }
    const metadata = this.getMetaData();
    for (const obj of list) {
      MetadataUtil.json(obj, metadata);
    }
    return list;
  }

  protected formatObject(obj): any {
    return MetadataUtil.json(obj, this.getMetaData());
  }
}
