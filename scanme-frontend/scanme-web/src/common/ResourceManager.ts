import Resources from '../resource/Resources';
import {Language} from './Language';

export class ResourceManager {
  private static _resource: any = Resources[Language.English];
  private static staticResource = Resources;
  public static setResource(locale, overrideResources?: any, flowResources?: any) {
    const overrideResourceCopy = Object.assign({}, overrideResources);
    const updateStaticResources = Object.keys(this.staticResource).reduce(
      (accumulator, currentValue) => {
        accumulator[currentValue] = {
          ...this.staticResource[currentValue],
          ...overrideResourceCopy[currentValue],
          ...flowResources[currentValue]
        };
        return accumulator;
      }, {});

    const originResources = Object.keys(flowResources).reduce(
      (accumulator, currentValue) => {
        if (accumulator[currentValue]) {
            accumulator[currentValue] = {
            ...overrideResources[currentValue],
            ...flowResources[currentValue]
          };
          return accumulator;
        }
        return { ...accumulator, [currentValue]: flowResources[currentValue]};
      }, overrideResourceCopy);

    const updateResources = {
      ...originResources,
      ...updateStaticResources
    };
    this._resource = updateResources[locale] || updateResources[Language.Thai];
  }

  public static getResource() {
    return this._resource;
  }

  public static getResourceByLocale(locale) {
    const resourceLocale = locale === Language.English ? Resources[Language.English] : Resources[Language.Thai];
    return resourceLocale;
  }

  public static getString(key, param: any = null): string {
    if (typeof this._resource !== 'undefined') {
      const str = this._resource[key];
      if (!str || str.length === 0) {
        return str;
      }
      if (!param) {
        return str;
      } else {
        if (typeof param === 'string') {
          let paramValue = this._resource[param];
          if (!paramValue) {
            paramValue = param;
          }
          return str.format(paramValue);
        }
      }
    } else {
      return '';
    }
  }

  public static format(key, keys: any) {
    const str = this.getString(key);
    if (Array.isArray(keys)) {
      const params = [];
      for (const keyItem of keys) {
        const param = this.getString(keyItem);
        params.push(param);
      }
      return this.formatString(str, params);
    } else {
      const param = this.getString(keys);
      return this.formatString(str, param);
    }
  }

  private static formatString(...args: any[]): string {
    let formatted = args[0];
    if (!formatted) {
      return '';
    }
    if (args.length > 1 && Array.isArray(args[1])) {
      const params = args[1];
      for (let i = 0; i < params.length; i++) {
        const regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, params[i]);
      }
    } else {
      for (let i = 1; i < args.length; i++) {
        const regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
        formatted = formatted.replace(regexp, args[i]);
      }
    }
    return formatted;
  }
}
