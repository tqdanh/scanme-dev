import {DataType} from '../../DataType';
import {Attribute} from '../../metadata/Attribute';
import {Model} from '../../metadata/Model';
import {SearchModel} from '../../model/SearchModel';
import {MongoQueryBuilder} from './MongoQueryBuilder';

export class DefaultMongoQueryBuilder<S extends SearchModel> implements MongoQueryBuilder<S> {
  buildQuery(s: S, model: Model): any {
    const a = new Array<[string, Array<[any, any]>]>();
    const b = new Array<[any, any]>();
    const keys = Object.keys(s);
    for (const key of keys) {
      const v = s[key];
      if (v) {
        const attr: Attribute = model.attributes[key];
        if (attr) {
          const field = (attr.field ? attr.field : key);
          if (typeof v === 'object') {
            if (attr.type === DataType.DateTime && this.isDateRange(v) ) {
              if (v['endDate'] && v['startDate']) {
                b['$lte'] = new Date(v['endDate']);
                b['$gte'] = new Date(v['startDate']);
              } else if (v['endDate']) {
                b['$lte'] = new Date(v['endDate']);
              } else if (v['startDate']) {
                b['$gte'] = new Date(v['startDate']);
              }
              const json1 = Object.assign({}, b);
              a[field] = json1;
            }
          } else if (typeof v === 'string' || typeof v === 'number') {
            a[field] = s[key];
          }
        }
      }
    }
    const json = Object.assign({}, a);
    return json;
  }
  private isDateRange(obj) {
    if (!obj.startDate && !obj.endDate) {
      return false;
    } else {
      return true;
    }
  }
}
