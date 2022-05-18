import {DefaultMetaModelBuilder} from '../builder/DefaultMetaModelBuilder';
import {MetaModel} from '../MetaModel';
import {Model} from '../Model';

export class MetadataUtil {
  private static _datereg = '/Date(';
  private static _re = /-?\d+/;
  private static _builder = new DefaultMetaModelBuilder();
  private static _cache: any = {};

  public static getMetaModel(model: Model): MetaModel {
    let meta: MetaModel = this._cache[model.name];
    if (!meta) {
      meta = this._builder.build(model);
      this._cache[model.name] = meta;
    }
    return meta;
  }

  public static json(obj: any, model: Model): any {
    const meta = this.getMetaModel(model);
    return this.jsonToDate(obj, meta.dateFields);
  }

  private static convertJsonToDate(dateStr) {
    if (!dateStr || dateStr === '') {
      return null;
    }
    const i = dateStr.indexOf(this._datereg);
    if (i >= 0) {
      const m = this._re.exec(dateStr);
      const d = parseInt(m[0], null);
      return new Date(d);
    } else {
      if (isNaN(dateStr)) {
        return new Date(dateStr);
      } else {
        const d = parseInt(dateStr, null);
        return new Date(d);
      }
    }
  }

  private static jsonToDate(obj, fields: string[]) {
    if (!obj || !fields) {
      return obj;
    }
    if (!Array.isArray(obj)) {
      for (const field of fields) {
        const val = obj[field];
        if (!!val) {
          obj[field] = this.convertJsonToDate(val);
        }
      }
    }
    return obj;
  }

  private static jsonArrayToDate<T>(objs: T[], fields: string[]) {
    if (!objs || !fields || fields.length === 0) {
      return objs;
    }
    if (Array.isArray(objs)) {
      // tslint:disable
      for (let j = 0; j < objs.length; j++) {
        for (let i = 0; i < fields.length; i++) {
          const val = objs[j][fields[i]];
          if (!!val) {
            objs[j][fields[i]] = this.convertJsonToDate(val);
          }
        }
      }
    }
    return objs;
  }
}
