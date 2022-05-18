import {NumberUtil} from './NumberUtil';

export class UIFormatterUtil {
  private static _nreg = / |,|\$|\€|\£|\£|¥/g;
  private static _preg = / |,|%|\$|\€|\£|\£|¥/g;
  public static removeNumberFormat(ctrl) {
    let v: any = UIFormatterUtil.trimText(ctrl.value);
    if (v.length === 0) {
      return;
    }
    v = v.replace(this._nreg, '');
    if (!isNaN(v)) {
      const n = parseFloat(v);
      const n2 = n.toString();
      if (n2 !== ctrl.value) {
        ctrl.value = n2;
      }
    }
  }

  public static removeCurrencyFormat(ctrl) {
    let v: any = UIFormatterUtil.trimText(ctrl.value);
    if (v.length === 0) {
      return;
    }
    v = v.replace(this._nreg, '');
    if (ctrl.form !== null && ctrl.form !== undefined) {
      const currencySymbol = ctrl.form.currencySymbol;
      if (v.indexOf(currencySymbol) >= 0) {
        v = v.replace(currencySymbol, '');
      }
    }
    if (!isNaN(v)) {
      const n = parseFloat(v);
      const n2 = n.toString();
      if (n2 !== ctrl.value) {
        ctrl.value = n2;
      }
    }
  }

  public static removePercentageFormat(ctrl) {
    let val: any = UIFormatterUtil.trimText(ctrl.value);
      if (val.length === 0) {
        return;
      }
      val = val.replace(this._preg, '');
      if (!isNaN(val)) {
        const n = parseFloat(val);
        const n2 = n.toString();
        if (n2 !== ctrl.value) {
          ctrl.value = n2;
        }
      }
  }

  public static formatControl(ctrl) {
    const datatype = ctrl.getAttribute('data-type');
    if (datatype === 'number' || datatype === 'int'
      || datatype === 'percentage' || datatype === 'currency') {
      let val;
      if (datatype === 'number' || datatype === 'int') {
        val = ctrl.value.replace(this._nreg, '');
      } else if (datatype === 'currency') {
        val = ctrl.value.replace(this._nreg, '');
        const symbol = ctrl.form.currencySymbol;
        if (symbol !== null) {
          val = val.replace(symbol, '');
        }
      } else if (datatype === 'percentage') {
        val = ctrl.value.replace(this._preg, '');
      }
      let val2 = val;
      const num = parseFloat(val);
      if (datatype === 'currency') {
        const form = ctrl.form;
        if (form !== null && form !== undefined) {
          let symbol = form.currencySymbol;
          let pattern = form.currencyPattern;
          let scale = form.currencyDecimalDigits;
          if (!symbol) {
            symbol = '$';
          }
          if (!pattern) {
            pattern = 0;
          }
          if (!scale) {
            scale = 2;
          }
          if (scale !== null && !isNaN(scale)) {
            val2 = NumberUtil.formatNumber(val, scale);
          } else {
            const numFormat = ctrl.getAttribute('number-format');
            if (numFormat !== null && numFormat.length > 0) {
              val2 = NumberUtil.format(num, numFormat);
            }
          }
          switch (pattern) {
            case 0:
              val2 = symbol + val2;
              break;
            case 1:
              val2 = '' + val2 + symbol;
              break;
            case 2:
              val2 = symbol + ' ' + val2;
              break;
            case 3:
              val2 = '' + val2 + ' ' + symbol;
              break;
            default:
              val2 = symbol + val2;
              break;
          }
          if (ctrl.value !== val2) {
            ctrl.value = val2;
          }
        }
      } else if (datatype === 'number' || datatype === 'int' || datatype === 'percentage') {
        const numFormat = ctrl.getAttribute('number-format');
        if (numFormat !== null && numFormat.length > 0) {
          val2 = NumberUtil.format(num, numFormat);
        } else {
          const scale = ctrl.getAttribute('scale');
          const n = num.toFixed(scale);
          val2 = NumberUtil.formatNumber(n.toString(), scale);
        }
        if (datatype === 'percentage') {
          val2 = val2 + '%';
        }
        if (ctrl.value !== val2) {
          ctrl.value = val2;
        }
      }
    }
  }

  private static trimText(s: string): string {
    if (!s) {
      return s;
    }
    s = s.trim();
    const sRetVal = '';
    let i = s.length - 1;
    while (i >= 0 && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
      i--;
    }
    s = s.substring(0, i + 1);
    i = 0;
    while (i < s.length && (s.charAt(i) === ' ' || s.charAt(i) === '\t' || s.charAt(i) === '\r' || s.charAt(i) === '\n')) {
      i++;
    }
    return s.substring(i);
  }
}
