export class JsonUtil {
  private static o = 'object';
  private static n = 'number';
  private static s = 'string';
  private static b = 'boolean';

  public static stringify(obj): string {
    return JSON.stringify(obj);
  }

  public static parse(obj: string): any {
    return JSON.parse(obj);
  }

  public static minimizeJson(obj: any): any {
    if (!obj || typeof obj !== this.o) {
      return obj;
    }
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const v = obj[keys[i]];
      if (!v) {
        delete obj[keys[i]];
      } else if (Array.isArray(v) && v.length > 0) {
        const v1 = v[0];
        if (!(v1 instanceof Date) && typeof v1 !== this.n && typeof v1 !== this.s && typeof v1 !== this.b) {
          for (let j = 0; j < v.length; j++) {
            this.minimizeJson(v[j]);
          }
        }
      }
    }
    return obj;
  }

  public static minimizeJsonList(arrs: any): any {
    if (!arrs) {
      return arrs;
    }
    for (let i = 0; i < arrs.length; i++) {
      this.minimizeJson(arrs[i]);
    }
    return arrs;
  }

  public static renameKeys(obj: any, newKeys: any): any {
    const keyValues = Object.keys(obj).map(key => {
      const newKey = newKeys[key] || key;
      return {[newKey]: obj[key]};
    });
    return Object.assign({}, ...keyValues);
  }

  public static findKey(data: any, keyName: string) {
    // tslint:disable-next-line:forin
    for (const key in data) {
      const entry = data[key];
      if (key === keyName) {
        return entry;
      }
      if (typeof entry === 'object') {
        const found = this.findKey(entry, keyName);
        if (found) {
          return found;
        }
      }
    }
  }

}
