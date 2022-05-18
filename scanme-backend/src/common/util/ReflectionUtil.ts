export class ReflectionUtil {
  public static trimString = (obj) => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const v = obj[key];
        obj[key] = (typeof v === 'string' && v !== null) ? v.trim() : v;
      });
    }
  }

  public static trimObject = (obj) => {
    Object.keys(obj).forEach(key => {
      const v = obj[key];
      if (v) {
        if (typeof v === 'string') {
          obj[key] = v.trim();
        } else if (typeof v === 'object') {
          ReflectionUtil.trimObject(obj[key]);
        }
      }
    });
  }
}
