export interface CookieService {
  /**
   * @param name Cookie name
   * @returns {boolean}
   */
  check(name);

  /**
   * @param name Cookie name
   * @returns {any}
   */
  get(name);

  /**
   * @returns {}
   */
  getAll();

  /**
   * @param name  Cookie name
   * @param value   Cookie value
   * @param expires Number of days until the cookies expires or an actual `Date`
   * @param path  Cookie path
   * @param domain  Cookie domain
   * @param secure  Secure flag
   */
  set(name, value, expires, path?, domain?, secure?);

  /**
   * @param name   Cookie name
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  delete(name, path?, domain?);

  /**
   * @param path   Cookie path
   * @param domain Cookie domain
   */
  deleteAll(path, domain);

  /**
   * @param name Cookie name
   * @returns {RegExp}
   */
  getCookieRegExp(name);
}
