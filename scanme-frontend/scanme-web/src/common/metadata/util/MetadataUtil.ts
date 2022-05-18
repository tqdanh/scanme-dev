import {DataType} from '../../DataType';
import {DefaultMetaModelBuilder} from '../builder/DefaultMetaModelBuilder';
import {MetaModel} from '../MetaModel';
import {Model} from '../Model';

export class SchemaError {
  field: string; // student.class[3].className;
  errorType: string;
}
export class MetadataUtil {
  private static _datereg = '/Date(';
  private static _re = /-?\d+/;
  private static _builder = new DefaultMetaModelBuilder();
  private static _cache: any = {};

  public static createModel(model: Model): any {
    const obj: any = {};
    const meta = this.getMetaModel(model);
    const attrs = meta.attributes;
    for (const attr of attrs) {
      switch (attr.type) {
        case DataType.Array:
          obj[attr.name] = [];
          break;
        case DataType.Bool:
          obj[attr.name] = false;
          break;
        case DataType.DateTime:
          obj[attr.name] = new Date();
          break;
        case DataType.Integer:
          obj[attr.name] = 0;
          break;
        case DataType.Number:
          obj[attr.name] = 0;
          break;
        case DataType.Object:
          if (!!attr.typeOf) {
            const object = this.createModel(attr.typeOf);
            obj[attr.name] = object;
            break;
          }
          obj[attr.name] = {};
          break;
        case DataType.ObjectId:
          obj[attr.name] = null;
          break;
        case DataType.String:
          obj[attr.name] = '';
          break;
        case DataType.Text:
          obj[attr.name] = '';
          break;
        default:
          obj[attr.name] = '';
          break;
      }
      // attr.type === DataType.Array ? obj[attr.name] = [] : obj[attr.name] = '';
    }
    return obj;
  }

  public static validateSchema(obj2: any, model: Model): SchemaError[] {
    const array = new Array();
    const keysofobj = Object.keys(obj2);
    for (const key of keysofobj) {
      const attr = model.attributes[key];
      if (!attr) {
        // if key is not in metadata
        const  smerr = new SchemaError();
        smerr.field = model.name + '.' + key ;
        smerr.errorType = 'UndefinedField';
        array.push(smerr);
      } else {
        const v = obj2[key];
        const attribute = model.attributes[key];
          if (attribute.type === 'DateTime') {
            // If value is not date
            const date  = this.convertJsonToDate(v);
            const error = date.toString();
            if (!(date instanceof Date) || error === 'Invalid Date') {
              const  smerr = new SchemaError();
              smerr.field = model.name + '.' + key ;
              smerr.errorType = 'DataTypeError';
              array.push(smerr);
            }
          }
          if (attribute.type === 'Integer' || attribute.type === 'Number') {
            // If value is not number
            if ((typeof v === 'number') !== true) {
              const  smerr = new SchemaError();
              smerr.field = model.name + '.' + key ;
              smerr.errorType = 'DataTypeError';
              array.push(smerr);
            }
          }
          if (attribute.type === 'String') {
            // If value is not string
            if ((typeof v === 'string') !== true) {
              const  smerr = new SchemaError();
              smerr.field = model.name + '.' + key ;
              smerr.errorType = 'DataTypeError';
              array.push(smerr);
            }
          }
          if (attribute.type === 'Bool') {
            // If value is not bool
            if ((typeof v === 'boolean') !== true) {
              const  smerr = new SchemaError();
              smerr.field = model.name + '.' + key ;
              smerr.errorType = 'DataTypeError';
              array.push(smerr);
            }
          }
          if (attribute.type === 'Object') {
            if ((typeof v === 'object') === true) {
              const attributetypeof = attribute['typeof'];
              attributetypeof.name = model.name + '.' + attributetypeof.name;
              const arrayerror = MetadataUtil.validateSchema(v, attributetypeof);
              // tslint:disable-next-line:only-arrow-functions
              arrayerror.forEach(function (value) {
                array.push(value);
            });
            }
          }
          if (attribute.type === 'Array') {
              const attributetypeof = attribute['typeof'];
              attributetypeof.name = model.name + '.' + attributetypeof.name;
              // tslint:disable-next-line:only-arrow-functions
              v.forEach(function (value) {
                const arrayerror = MetadataUtil.validateSchema(value, attributetypeof);
                // tslint:disable-next-line:only-arrow-functions
                arrayerror.forEach(function (valueerror) {
                  array.push(valueerror);
              });
            });
          }
        }
    }
    return array;
  }

  public static createModelJustContainPrimaryKeys(model: Model): any {
    const obj: any = {};
    const meta = this.getMetaModel(model);
    const attrs = meta.attributes;
    for (const attr of attrs) {
      if (attr.primaryKey) {
        attr.type === DataType.Array ? obj[attr.name] = [] : obj[attr.name] = '';
      }
    }
    return obj;
  }

  public static getMetaModel(model: Model): MetaModel {
    let meta: MetaModel = this._cache[model.name];
    if (!meta) {
      meta = this._builder.build(model);
      this._cache[model.name] = meta;
    }
    return meta;
  }

  // Use parse datetime string field to datetime date field.
  public static json(obj: any, model: Model): any {
    const meta = this.getMetaModel(model);
    const obj2 = this.jsonToDate(obj, meta.dateFields);
    if (meta.objectFields) {
      for (const objectField of meta.objectFields) {
        if (obj2[objectField.model.name]) {
          this.json(obj2, objectField.model);
        }
      }
    }
    if (meta.arrayFields) {
      for (const arrayField of meta.arrayFields) {
        if (obj2[arrayField.model.name]) {
          this.json(obj2, arrayField.model);
        }
      }
    }
    return obj2;
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
        if (!!val && !(val instanceof Date)) {
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

