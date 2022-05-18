import {cloneDeep} from 'lodash';
import {SearchModel} from '../model/SearchModel';
import {DateUtil} from './DateUtil';

export class SearchUtil {
  private static removeFormatUrl(url: string) {
    const startParams = url.indexOf('?');
    return startParams !== -1 ? url.substring(0, startParams) : url;
  }

  public static addParametersIntoUrl(searchModel2, isFirstLoad) {
    if (!isFirstLoad) {
      const searchModel = cloneDeep(searchModel2);
      const pageIndex = searchModel.pageIndex;
      if (pageIndex && !isNaN(pageIndex) && pageIndex <= 1) {
        delete searchModel.pageIndex;
      }
      const keys = Object.keys(searchModel);
      const currentUrl = window.location.host + window.location.pathname;
      let url = this.removeFormatUrl(currentUrl);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < keys.length; i++) {
        const objValue = searchModel[keys[i]];
        if  (objValue && typeof objValue === 'string') {
          if (url.indexOf('?') === -1) {
            url += `?${keys[i]}=${objValue}`;
          } else {
            url += `&${keys[i]}=${objValue}`;
          }
        } else if (objValue && typeof objValue === 'object') {
          if (objValue instanceof Date) {
            if (url.indexOf('?') === -1) {
              url += `?${keys[i]}=${DateUtil.toISO(objValue)}`;
            } else {
              url += `&${keys[i]}=${DateUtil.toISO(objValue)}`;
            }
          } else {
            const keysLvl2 = Object.keys(objValue);
            keysLvl2.forEach((key, idx) => {
              const objValueLvl2 = objValue[keysLvl2[idx]];
              if (url.indexOf('?') === -1) {
                url += `?${keys[i]}.${key}=${DateUtil.toISO(objValueLvl2)}`;
              } else {
                url += `&${keys[i]}.${key}=${DateUtil.toISO(objValueLvl2)}`;
              }
            });
          }
        }
      }
      let p = 'http://';
      if (window.location.href.startsWith('https://')) {
        p = 'https://';
      }
      window.history.replaceState({path: currentUrl}, '', p + url);
    }
  }

  public static getPageTotal(recordTotal: number, pageSize: number) {
    if (pageSize <= 0) {
      return 1;
    } else {
      if ((recordTotal % pageSize) === 0) {
        return Math.floor((recordTotal / pageSize));
      }
      return Math.floor((recordTotal / pageSize) + 1);
    }
  }

  public static optimizeSearchModel<S extends SearchModel>(s: S): S {
    const keys = Object.keys(s);
    const o: any = {};
    for (const key of keys) {
      const p = s[key];
      if (key === 'pageIndex') {
        if (!!p && p >= 1) {
          o[key] = p;
        } else {
          o[key] = 1;
        }
      } else if (key === 'pageSize') {
        if (!!p && p >= 1) {
          o[key] = p;
        }
      } else if (key === 'initPageSize') {
        if (!!p && p >= 1) {
          o[key] = p;
        }
      } else {
        if (!!p && p !== '') {
          o[key] = p;
        }
      }
    }
    o.includeTotal = true;
    if (o.pageSize != null && o.initPageSize === o.pageSize) {
      delete o['initPageSize'];
    }
    for (const key of Object.keys(o)) {
      if (Array.isArray(o[key]) && o[key].length === 0) {
        delete o[key];
      }
    }
    return o;
  }
}
