export class NumberUtil {
  private static _nreg = / |,|\$|\€|\£|\£|¥/g;

  public static formatNumber(value: any, scale?: number): string {
    if (!value) {
      return '';
    }
    if (scale == null || scale === undefined) {
      scale = 2;
    } else if (scale < 0) {
      scale = 0;
    }

    if (typeof value === 'number') {
      value = value.toFixed(scale);
    } else {
      if (typeof value !== 'string') {
        value = value.toString();
      }
    }
    if (isNaN(value) && value.includes('.')) {
      return value;
    } else if (value.indexOf(',') === -1 && value.includes('.')) {
      const prefix = value.split('.')[0];
      if (prefix.length < 3) {
        return value;
      }
    }
    let amount = value.replace(this._nreg, '');
    const delimiter = ',';
    const a = amount.split('.', 2);
    let d = '';
    if (a[0].length === 0) {
      a[0] = '0';
    }
    if (a.length >= 2) {
      d = a[1];
    }
    a[0] = a[0].replace(delimiter, '');
    let i = 0;
    if (!isNaN(a[0])) {
      i = parseInt(a[0], null);
    }
    let minus = '';
    if (i < 0) {
      minus = '-';
    }
    i = Math.abs(i);
    let n = i + '';
    const b = [];

    while (n.length > 3) {
      const nn = n.substring(n.length - 3);
      b.unshift(nn);
      n = n.substring(0, n.length - 3);
    }
    if (n.length > 0) {
      b.unshift(n);
    }
    n = b.join(delimiter);
    if (d.length < 1) {
      amount = n;
    } else {
      amount = n + '.' + d;
    }
    amount = minus + amount;

    return amount;
  }

  public static formatInteger = (number) => {
    return NumberUtil.formatNumber(number, 0);
  }

  public static parseNumber(value: any, scale): number {
    if (!value) {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value !== 'string') {
      return null;
    }

    let v: any = value.replace(this._nreg, '');
    if (isNaN(v)) {
      return null;
    }
    v = parseFloat(v);
    if (scale != null && (typeof scale === 'number') && scale === 0) {
      v = Math.floor(v);
      return v;
    }
    return v;
  }

  public static stringToNumber(value: any, scale: any = null): number {
    if (!value) {
      return 0;
    }
    if (typeof value === 'string') {
      value = value.replace(this._nreg, '');
    }
    if (isNaN(value)) {
      return 0;
    }
    value = parseFloat(value);
    if (!scale) {
      return value;
    }
    if (typeof scale === 'number' && scale === 0) {
      value = Math.floor(value);
      return value;
    }
    return value;
  }

  public static round(value: any, scale: number = null): any {
    if (!value) {
      return '';
    }
    if (!scale) {
      scale = 2;
    }
    if (typeof value === 'number') {
      value = value.toString();
      if (value.indexOf('.') === -1 && value.indexOf(',') === -1) {
        return parseInt(value, null);
      } else {
        value = parseFloat(value);
        return value.toFixed(scale);
      }
    } else {
      if (typeof value !== 'string') {
        value = value.toString();
      }
      if (!value || value.length === 0) {
        return '';
      }
      if (value.indexOf('.') === -1 && value.indexOf(',') === -1) {
        return parseInt(value, null);
      } else {
        value = parseFloat(value);
        return value.toFixed(scale);
      }
    }
  }

  public static isNumber(value: any): boolean {
    if (!value) {
      return false;
    }
    if (typeof value !== 'string') {
      value = value.toString();
    }
    if (!value || value.length === 0) {
      return false;
    }
    if (value.indexOf('.') === -1 && value.indexOf(',') === -1) {
      return false;
    }
    value = parseFloat(value);
    if (!value) {
      return false;
    }
    return true;
  }

  public static getOrdinalNumber(value: any): string {
    if (!value || value === 0 || value === '') {
      return value;
    }
    const s = ['th', 'st', 'nd', 'rd'];
    const v = value % 100;
    return (parseInt(value, null) + (s[(v - 20) % 10] || s[v] || s[0])).replace(' ', '');
  }

  public static getNatural(num): any {
    return parseFloat(num.toFixed(2).toString().split('.')[0]);
  }

  public static getDecimal(num): any {
    const decimal = parseFloat(num.toFixed(2).toString().split('.')[1]);
    if (decimal < 10) {
      return decimal.toString() + '0';
    }
    return decimal.toString();
  }

  /* tslint:disable */
  public static format(a: any, b: any): string {
    let j: any, e: any, h: any, c: any;
    a = a + '';
    if (a == 0 || a == '0') return '0';
    if (!b || isNaN(+a)) return a;
    a = b.charAt(0) == '-' ? -a : +a, j = a < 0 ? a = -a : 0, e = b.match(/[^\d\-\+#]/g), h = e &&
      e[e.length - 1] || '.', e = e && e[1] && e[0] || ',', b = b.split(h), a = a.toFixed(b[1] && b[1].length),
    a = +a + '', d = b[1] && b[1].lastIndexOf('0'), c = a.split('.');
    if (!c[1] || c[1] && c[1].length <= d) a = (+a).toFixed(d + 1);
    d = b[0].split(e); b[0] = d.join('');
    let f = b[0] && b[0].indexOf('0');
    if (f > -1) for (; c[0].length < b[0].length - f;) c[0] = '0' + c[0];
    else +c[0] == 0 && (c[0] = '');
    a = a.split('.'); a[0] = c[0];
    if (c = d[1] && d[d.length - 1].length) {
      f = '';
      for (var d = a[0], k = d.length % c, g = 0, i = d.length; g < i; g++)
        f += d.charAt(g), !((g - k + 1) % c) && g < i - c && (f += e);
      a[0] = f;
    } a[1] = b[1] && a[1] ? h + a[1] : '';
    return (j ? '-' : '') + a[0] + a[1];
  }
}
