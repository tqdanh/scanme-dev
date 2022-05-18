import * as moment from 'moment';
import LocaleResources from '../LocaleResources';
import {Locale} from '../model/Locale';
import ShortLocaleIdMap from '../ShortLocaleIdMap';

export interface LocaleService {
  getLocale(id: string): Locale;
  getLocaleOrDefault(id: string): Locale;
  getZeroCurrencyByLanguage(language: string);
  getZeroCurrency(locale: Locale);
  formatDate(value: Date, locale: Locale): string;
  formatCurrency(value: any, locale: Locale): string;
  formatInteger(value: any, locale: Locale): string;
}

class DefaultLocaleService implements LocaleService {
  private _nreg = / |,|\$|\€|\£|\£|¥/g;

  getLocale(id: string): Locale {
    let locale = this.getLocaleFromResources(id);
    if (!locale) {
      const newId = ShortLocaleIdMap.get(id);
      locale = this.getLocaleFromResources(newId);
    }
    return locale;
  }

  getLocaleOrDefault(id: string): Locale {
    let locale = this.getLocaleFromResources(id);
    if (!locale) {
      const newId = ShortLocaleIdMap.get(id);
      locale = this.getLocaleFromResources(newId);
    }
    if (!locale) {
      locale = this.getLocaleFromResources('en-US');
    }
    return locale;
  }

  private getLocaleFromResources(id: string): Locale {
    return LocaleResources[id];
  }

  getZeroCurrencyByLanguage(language: string) {
    return this.getZeroCurrency(this.getLocale(language));
  }

  getZeroCurrency(locale: Locale) {
    if (locale) {
      if (locale.currencyDecimalDigits <= 0) {
        return '0';
      } else {
        const start = '0' + locale.decimalSeparator;
        const padLength = start.length + locale.currencyDecimalDigits;
        return this.padRight(start, padLength, '0');
      }
    } else  {
      return '0.00';
    }
  }

  formatDate(value: Date, locale: Locale): string {
    if (!value) {
      return '';
    }
    if (locale) {
      return moment(value).format(locale.dateFormat.toUpperCase());
    } else {
      return moment(value).format('M/D/YYYY');
    }
  }

  formatCurrency(value: any, locale: Locale): string {
    if (!value) {
      return '';
    }
    if (locale) {
      const scale = (locale.currencyDecimalDigits && locale.currencyDecimalDigits >= 0 ? locale.currencyDecimalDigits : 2);
      return this._formatNumber(value, scale, locale.decimalSeparator, locale.currencyGroupSeparator);
    } else {
      return this._formatNumber(value, 2, '.', ',');
    }
  }

  formatInteger(value: any, locale: Locale): string {
    if (locale) {
      return this._formatNumber(value, 0, locale.decimalSeparator, locale.currencyGroupSeparator);
    } else {
      return this._formatNumber(value, 0, '.', ',');
    }
  }

  private _formatNumber(value: any, scale: number, decimalSeparator: string, groupSeparator: string): string {
    if (!value) {
      return '';
    }
    if (!groupSeparator && !decimalSeparator) {
      groupSeparator = ',';
      decimalSeparator = '.';
    } else {
      if (decimalSeparator === '.') {
        groupSeparator = ',';
      } else if (decimalSeparator === ',') {
        groupSeparator = '.';
      } else if (groupSeparator === '.') {
        decimalSeparator = ',';
      } else if (groupSeparator === ',') {
        decimalSeparator = '.';
      }
    }

    if (typeof value === 'number') {
      value = value.toFixed(scale);
    } else {
      if (typeof value !== 'string') {
        value = value.toString();
      }
    }
    if (isNaN(value) && value.includes(decimalSeparator)) {
      return value;
    } else if (value.indexOf(groupSeparator) === -1 && value.includes(decimalSeparator)) {
      const prefix = value.split(decimalSeparator)[0];
      if (prefix.length < 3) {
        return value;
      }
    }
    let amount = value.replace(this._nreg, '');

    const a = amount.split(decimalSeparator, 2);
    let d = '';
    if (a[0].length === 0) {
      a[0] = '0';
    }
    if (a.length >= 2) {
      d = a[1];
    }
    a[0] = a[0].replace(groupSeparator, '');
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
    n = b.join(groupSeparator);
    if (d.length < 1) {
      amount = n;
    } else {
      amount = n + decimalSeparator + d;
    }
    amount = minus + amount;

    return amount;
  }

  private padRight(str, length, pad) {
    if (!str) {
      return str;
    }
    if (typeof str !== 'string') {
      str = '' + str;
    }
    if (str.length >= length) {
      return str;
    }
    let str2 = str;
    if (!pad) {
      pad = ' ';
    }
    while (str2.length < length) {
      str2 = str2 + pad;
    }
    return str2;
  }
}

export const localeService = new DefaultLocaleService();
