export class JsonUtil {
  private static o = 'object';
  private static n = 'number';
  private static s = 'string';
  private static b = 'boolean';

  public static serializeDate(obj) {
    const keys = Object.keys(obj);
    for (const item of keys) {
      const key = item;
      const v = obj[key];
      if (!!v) {
        // Object maybe is DateRange.
        if (v instanceof Object ) {
          obj[key] = this.serializeDate(obj[key]);
        }
        if (v instanceof Date) {
          obj[key] = obj[key].toISOString();
        }
      }
    }
    return obj;
  }

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
    for (const key of keys) {
      const v = obj[key];
      if (!v) {
        delete obj[key];
      } else if (Array.isArray(v) && v.length > 0) {
        const v1 = v[0];
        if (!(v1 instanceof Date) && typeof v1 !== this.n && typeof v1 !== this.s && typeof v1 !== this.b) {
          for (const vItem of v) {
            this.minimizeJson(vItem);
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
    for (const item of arrs) {
      this.minimizeJson(item);
    }
    return arrs;
  }

  public static stringToArray(value: string | string[]): string[] {
    if (value === '' || !value) {
      return [];
    } else {
      if (Array.isArray(value)) {
        return value;
      } else {
        return JSON.parse(value);
      }
    }
  }
}
