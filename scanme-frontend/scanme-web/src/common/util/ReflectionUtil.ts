import {isEqual, isObject, transform} from 'lodash';

export class ReflectionUtil {
  private static isEmpty = value => value === undefined || value === null || value === '';

  private static iteratee = base => (result, value, key) => {
    if (!isEqual(value, base[key])) {
      const valIsObj = isObject(value) && isObject(base[key]);
      if (!(ReflectionUtil.isEmpty(value) && ReflectionUtil.isEmpty(base[key]))) {
        result[key] = valIsObj === true ? ReflectionUtil.diff(value, base[key]) : [base[key], value];
      }
    }
  }

  public static diff(obj, base) {
    return transform(obj, ReflectionUtil.iteratee(base));
  }

  private static getDirectValue = (object, key) => {
    if (object && object.hasOwnProperty(key)) {
      return object[key];
    }
    return null;
  }

  public static valueOf = (obj, key: string) => {
    const mapper = key.split('.').map(item => {
      return item.replace(/\[/g, '.[').replace(/\[|\]/g, '');
    });
    const reSplit = mapper.join('.').split('.');
    return reSplit.reduce((acc, current, index, source) => {
      const value = ReflectionUtil.getDirectValue(acc, current);
      if (!value) {
        source.splice(1);
      }
      return value;
    }, obj);
  }

  public static getValueObject = (obj) => {
    const vals = [];
    // tslint:disable-next-line:forin
    for (const prop in obj) {
      vals.push(obj[prop]);
    }
    return vals;
  }

  public static setValue(obj, key: string, value) {
    let replaceKey = key.replace(/\[/g, '.[').replace(/\.\./g, '.');
    if (replaceKey.indexOf('.') === 0) {
      replaceKey = replaceKey.slice(1, replaceKey.length);
    }
    const keys = replaceKey.split('.');
    let firstKey;
    firstKey = keys.shift();
    const isArrayKey = /\[([0-9]+)\]/.test(firstKey);
    // let copy;
    // if (isArrayKey && (Array.isArray(obj) || (obj === undefined || obj === null))) {
    //   copy = obj ? [...obj] : [];
    //   firstKey = parseInt(firstKey.replace(/\[|\]/, ''), 2);
    // } else if (!isArrayKey && (!Array.isArray(obj) || (obj === undefined || obj === null))) {
    //   copy = obj ? Object.assign({}, obj) : {};
    // } else {
    //   throw new Error('Object type not match keyPath: ' + key);
    // }

    const setKey = (_object, _isArrayKey, _key, _nextValue) => {
      if (_isArrayKey) {
        if (_object.length > _key) {
          _object[_key] = _nextValue;
        } else {
          _object.push(_nextValue);
        }
      } else {
        _object[_key] = _nextValue;
      }
      return _object;
    };

    if (keys.length > 0) {
      const firstKeyValue = obj[firstKey] || {};
      const returnValue = ReflectionUtil.setValue(firstKeyValue, keys.join('.'), value);
      return setKey(obj, isArrayKey, firstKey, returnValue);
    }
    return setKey(obj, isArrayKey, firstKey, value);
  }

  public static isObjEmpty(obj: object) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  public static isNull(obj) {
    return !obj;
  }
  public static clone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  public static cloneObject(obj: any): any {
    if (!obj) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return Object.assign([], obj);
    }
    return this.clone(obj);
  }

  public static trimString = (obj) => {
    const obj2 = {};
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v && typeof v === 'string') {
        const v2 = v.trim();
        if (v2 !== v) {
          obj2[key] = v2;
        }
      }
    });
    return obj2;
  }

  public static trimObject = (obj) => {
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v) {
        if (typeof v === 'string') {
          const v2 = v.trim();
          if (v2 !== v) {
            obj[key] = v2;
          }
        } else if (typeof v === 'object') {
          ReflectionUtil.trimObject(obj[key]);
        }
      }
    });
    return obj;
  }

  public static isEqualObject(obj1, obj2) {
    return (obj1 && obj2 && typeof obj1 === 'object' && typeof obj2 === 'object') ?
      (Object.keys(obj1).length === Object.keys(obj2).length) &&
      Object.keys(obj1).reduce((isEqual2, key) => {
        return isEqual2 && this.isEqualObject(obj1[key], obj2[key]);
      }, true) : (obj1 === obj2);
  }

  public static isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  public static mergeDeep(...objects) {
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = pVal.concat(...oVal);
        } else { if (ReflectionUtil.isObject(pVal) && ReflectionUtil.isObject(oVal)) {
          prev[key] = ReflectionUtil.mergeDeep(pVal, oVal);
        } else {
          prev[key] =  ReflectionUtil.isEmpty(oVal) ? pVal || '' : oVal;
        }
    }
      });
      return prev;
    }, {});
  }

  public static deepClone(obj: object) {
    let objClone = {};
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj.constructor !== Object && obj.constructor !== Array || obj.constructor === Function) {
      return obj;
    }
    if (obj.constructor === Date || obj.constructor === RegExp || obj.constructor === Function ||
      obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean) {
      return obj.constructor(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => Array.isArray(item) ? ReflectionUtil.deepClone(item) : item);
    }
    objClone = objClone || obj.constructor();

    Object.keys(obj).forEach((name) => {
      objClone[name] = typeof objClone[name] === 'undefined' ? ReflectionUtil.deepClone(obj[name]) : objClone[name];
    });
    return objClone;
  }
}


