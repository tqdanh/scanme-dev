import {Collection} from 'mongodb';
import {Observable, zip} from 'rxjs';
import {map} from 'rxjs/operators';
import {Model} from '../../metadata/Model';
import {MetadataUtil} from '../../metadata/util/MetadataUtil';
import {SearchResult} from '../../model/SearchResult';
import {MongoUtil} from '../../util/MongoUtil';
import {MongoSearchResultBuilder} from './MongoSearchResultBuilder';

export class DefaultMongoSearchResultBuilder implements MongoSearchResultBuilder {
  build<T>(collection: Collection, query: any, sort: any, pageIndex: number, pageSize: number, idName: string, model?: Model): Observable<SearchResult<T>> {
    console.log('query', query);
    const obsContents = MongoUtil.rxFind(collection, query, sort, pageSize, pageSize * (pageIndex - 1)).pipe(map((results: Array<T>) => {
      // return results.map(obj => MongoUtil.map(obj, idName));
      if (!model) {
        return MongoUtil.mapArray(results, idName);
      } else {
        const metadata = MetadataUtil.getMetaModel(model);
        return MongoUtil.mapArray(results, idName);
      }
      // return results.map(obj => MongoUtil.map(obj, idName));
    }));

    const obsCount = MongoUtil.rxCount(collection, query);

    return zip(obsContents, obsCount, ((contents: Array<T>, count) => {
      // @ts-ignore
      const results: SearchResult<T> = {};

      // results.pageIndex = pageIndex;
      // results.pageSize = pageSize;
      // results.initPageSize = pageSize;
      results.itemTotal = count;
      // results.lastPage = pageSize * pageIndex + contents.length >= count;
      results.results = contents;

      return results;
    }));
  }
}
