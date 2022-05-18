import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '../../metadata/Model';
import {MetadataUtil} from '../../metadata/util/MetadataUtil';
import {ResultInfo} from '../../model/ResultInfo';
import {ReflectionUtil} from '../../util/ReflectionUtil';
import {WebClientUtil} from '../../util/WebClientUtil';
import {GenericService} from '../GenericService';
import {ViewWebService} from './ViewWebService';

export class GenericWebService<T> extends ViewWebService<T> implements GenericService<T> {
  constructor(serviceUrl: string, model: Model) {
    super(serviceUrl, model);
  }

  protected formatResultInfo(result: ResultInfo<T>): ResultInfo<T> {
    result.value = MetadataUtil.json(result.value, this.getMetaData());
    return result;
  }

  insert(obj: T): Observable<ResultInfo<T>> {
    const obj2 = ReflectionUtil.clone(obj);
    const metadata = this.getMetaData();
    MetadataUtil.json(obj, metadata);
    MetadataUtil.validateSchema(obj2, metadata);
    return WebClientUtil.postRequest(this.serviceUrl, obj2)
      .pipe(map((res: any) => this.formatResultInfo(res)));
  }

  update(obj: T): Observable<ResultInfo<T>> {
    const obj2 = ReflectionUtil.clone(obj);
    const metadata = this.getMetaData();
    const meta = MetadataUtil.getMetaModel(metadata);
    let url = this.serviceUrl;
    for (const item of meta.primaryKeys) {
      url += '/' + obj2[item.name];
    }
    MetadataUtil.json(obj, metadata);
    MetadataUtil.validateSchema(obj2, metadata);
    return WebClientUtil.putRequest(url, obj2)
      .pipe(map((res: any) => this.formatResultInfo(res)));
  }

  patch(obj: T, body: object): Observable<ResultInfo<T>> {
    const obj2 = ReflectionUtil.clone(body);
    const metadata = this.getMetaData();
    const meta = MetadataUtil.getMetaModel(metadata);
    let url = this.serviceUrl + '/partial';
    for (const item of meta.primaryKeys) {
      url += '/' + obj[item.name];
    }
    MetadataUtil.json(obj, metadata);
    MetadataUtil.validateSchema(obj2, metadata);
    return WebClientUtil.patchRequest(url, body)
      .pipe(map((res: any) => this.formatResultInfo(res)));
  }

  delete(id: string): Observable<ResultInfo<T>> {
    return WebClientUtil.deleteRequest(this.serviceUrl + '/' + id)
      .pipe(map((res: any) => this.formatResultInfo(res)));
  }
}
