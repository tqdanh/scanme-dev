export class ValidationUtil {
  private static _emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
  private static _phoneRegex = /^[1]?[-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private static _phoneRegex2 = /^[+][1][-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  private static _creg = / |,|\$|\€|\£|\£|¥/g;
  private static _passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

  private static _urlRegExp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  private static _intRegex = /^\d+$/;

  private static _percentRegex = /^[1-9][0-9]?$|^100$/;
  private static _digitRegExp = /^\d+$/;
  private static _characterOrDigitRegExp = /^\w*\d*$/;
  private static _numberAndDashRegExp = /^[0-9-]*$/;

  private static isEmpty(str: string): boolean {
    return (!str || str === '');
  }

  public static isEmail(email: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }
    return this._emailReg.test(email);
  }

  public static isPhone(str: string): boolean {
    // const intRegex = /^[1]?([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    // Ed. With optional brackets (actually parenthesis) for area code (untested):
    return this._phoneRegex.test(str) || this._phoneRegex2.test(str);
  }

  public static isEmptyCurrency(value: string): boolean {
    if (value) {
      let v = value.trim();
      v = v.replace(this._creg, '');
      if (v.length === 0) {
        return true;
      } else if (isNaN(parseFloat(v))) {
        return false;
      } else {
        const num = parseFloat(v);
        return (num === 0 ? true : false);
      }
    }
    return true;
  }

  public static isValidPassword(password: string): boolean {
    return this._passwordRegex.test(password);
  }

  /*private static _urlReg =/^(ftp|https?):\/\/+(www\.)?([0-9A-Za-z-\\
  .@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?/i;
      public static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
          '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
      },
      private static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)' +
          '?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
    },*/
  public static isValidPattern(patternStr: string, modifier: string, value: string): boolean {
    if (!ValidationUtil.isEmpty(patternStr)) {
      const pattern = new RegExp(patternStr, modifier);
      return pattern.test(value);
    } else {
      return false;
    }
  }

  public static isValidURL(url: string): boolean {
    return this._urlRegExp.test(url);
  }

  public static isInteger(a): boolean {
    return this._intRegex.test(a);
  }

  public static isPercentage(a): boolean {
    return this._percentRegex.test(a);
  }

  public static isTime4(str: string): boolean {
    if (!str || str.length !== 4) {
      return false;
    }
    if (this.isInteger(str) === false) {
      return false;
    }
    const hours = parseInt(str.substring(0, 2), null);
    const minutes = parseInt(str.substring(2), null);
    if (hours > 24 || minutes > 59) {
      return false;
    } else {
      return true;
    }
  }

  public static isLong(value): boolean {
    if (!value || value.length === 0) {
      return false;
    } else if (value.indexOf('.') >= 0) {
      return false;
    } else if (isNaN(value)) {
      return false;
    } else {
      return true;
    }
  }

  public static isULong(value): boolean {
    if (!value || value.length === 0) {
      return false;
    } else if (value.indexOf('.') >= 0) {
      return false;
    } else if (isNaN(value)) {
      return false;
    } else {
      if (value >= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  public static toInt(value): number {
    if (!value || value === '') {
      return 0;
    }
    if (isNaN(parseInt(value, null))) {
      return 0;
    }
    return parseInt(value, null);
  }

  public static isDigitalCode(str: string): boolean {
    return this._digitRegExp.test(str);
  }

  public static isCharacterOrDigitCode(str: string): boolean {
    return this._characterOrDigitRegExp.test(str);
  }

  public static isDigitOnly(str: string): boolean {
    if (!str) {
      return false;
    }
    return this._digitRegExp.test(str);
  }

  public static isStringAccountNumber(stringAccountNumber): boolean {
    return this._digitRegExp.test(stringAccountNumber);
  }

  public static isStringNumberAndDash(stringRoutingNumber): boolean {
    return this._numberAndDashRegExp.test(stringRoutingNumber);
  }

  public static isStringCheckNumber(stringCheckNumber): boolean {
    const RegExp = /^\d{0,8}$/;
    return RegExp.test(stringCheckNumber);
  }

  public static isStringSSNNumber(stringNumber): boolean {
    const RegExp = /^\d+$/;
    return RegExp.test(stringNumber);
  }

  public static isAmountNumber(amountNumber): boolean {
    const regExp = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/;
    return regExp.test(amountNumber);
  }

  public static isUSPostalCode(postalCode): boolean {
    const regExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    return regExp.test(postalCode);
  }

  public static isCAPostalCode(postalCode): boolean {
    // For Canada Postal codes do not include the letters D, F, I, O, Q or U, and the first position also does not make use of the letters W or Z.
    const regExp = /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/;
    // /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return regExp.test(postalCode);
  }

  public static getTimeViews(): any {
    const arr = [{
      value: '00',
      text: '00'
    },
    {
      value: '15',
      text: '15'
    },
    {
      value: '30',
      text: '30'
    },
    {
      value: '45',
      text: '45'
    }];
    return arr;
  }

  public static getDayOfWeek(): any {
    const arr = [
      {
        value: '0',
        text: 'Monday'
      },
      {
        value: '1',
        text: 'Tuesday'
      },
      {
        value: '2',
        text: 'Wednesday'
      },
      {
        value: '3',
        text: 'Thursday'
      },
      {
        value: '4',
        text: 'Friday'
      },
      {
        value: '5',
        text: 'Saturday'
      },
      {
        value: '6',
        text: 'Sunday'
      }];
    return arr;
  }

  public static getMax(array): any {
    return Math.max.apply(Math, array);
  }

  // Input is 2230 -> 22.5
  public static getHours(str): any {
    const natural = Math.floor(str / 100);
    const decimal = (str % 100) / 60;
    return natural + decimal;
  }
}
