import {CookieService} from './CookieService';

export class DefaultCookieService implements CookieService {
  private document;
  private documentIsAccessible = true;

  constructor(document: any) {
    this.document = document;
  }

  /**
   * @param name Cookie name
   * @returns {boolean}
   */
  check(name) {
    if (!this.documentIsAccessible) {
      return false;
    }
    name = encodeURIComponent(name);
    const regExp = this.getCookieRegExp(name);
    const exists = regExp.test(this.document.cookie);
    return exists;
  }

  /**
   * @param name Cookie name
   * @returns {any}
   */
  get(name) {
    if (this.documentIsAccessible && this.check(name)) {
      name = encodeURIComponent(name);
      const regExp = this.getCookieRegExp(name);
      const result = regExp.exec(this.document.cookie);
      return decodeURIComponent(result[1]);
    } else {
      return '';
    }
  }

  /**
   * @returns {}
   */
  getAll() {
    if (!this.documentIsAccessible) {
      return {};
    }
    const cookies = {};
    const document = this.document;
    if (document.cookie && document.cookie !== '') {
      const split = document.cookie.split(';');
      for (const item of split) {
        const currentCookie = item.split('=');
        currentCookie[0] = currentCookie[0].replace(/^ /, '');
        cookies[decodeURIComponent(currentCookie[0])] = decodeURIComponent(currentCookie[1]);
      }
    }
    return cookies;
  }

  /**
   * @param name  Cookie name
   * @param value   Cookie value
   * @param expires Number of days until the cookies expires or an actual `Date`
   * @param path  Cookie path
   * @param domain  Cookie domain
   * @param secure  Secure flag
   */
  set(name, value, expires, path?, domain?, secure?) {
    if (!this.documentIsAccessible) {
      return;
    }
    let cookieString = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';
    if (expires) {
      if (typeof expires === 'number') {
        const dateExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
        cookieString += 'expires=' + dateExpires.toUTCString() + ';';
      } else {
        cookieString += 'expires=' + expires.toUTCString() + ';';
      }
    }
    if (path) {
      cookieString += 'path=' + path + ';';
    }
    if (domain) {
      cookieString += 'domain=' + domain + ';';
    }
    if (secure) {
      cookieString += 'secure;';
    }
    this.document.cookie = cookieString;
  }

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name, path?, domain?) {
    if (!this.documentIsAccessible) {
      return;
    }
    this.set(name, '', -1, path, domain);
  }

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path, domain) {
    if (!this.documentIsAccessible) {
      return;
    }
    const cookies = this.getAll();
    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.delete(cookieName, path, domain);
      }
    }
  }

  /**
   * @param name Cookie name
   * @returns {RegExp}
   */
  getCookieRegExp(name) {
    const escapedName = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');
    return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
  }
}
