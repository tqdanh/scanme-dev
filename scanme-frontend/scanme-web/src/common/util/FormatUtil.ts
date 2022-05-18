export class FormatUtil {

  public static removePhoneFormat(phone: string): string {
    if (phone) {
      return phone.replace(/ |\+|\-|\.|\(|\)/g, '');
    } else {
      return phone;
    }
  }
/*
  public static formatCurrency(currency, decimalCount = 2, decimal = '.', thousands = ',') {
    const strCurrency = currency ? currency.toString() : '';
    if (
      !strCurrency ||
      strCurrency.indexOf(',') !== -1 ||
      (strCurrency.length < 6 && strCurrency.indexOf('.') !== -1) ||
      strCurrency.length < 4 ||
      strCurrency.indexOf(',') === -1 && typeof(currency) !== 'number' ||
      (strCurrency.length < 6 && strCurrency.indexOf('.') === -1 && typeof(currency) !== 'number')
    ) {
      return strCurrency;
    } else {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const amount = Number(currency);
        const negativeSign = amount < 0 ? '-' : '';
        const i = parseInt(currency = Math.abs(Number(amount) || 0).toFixed(decimalCount), null).toString();
        const j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - Number(i)).toFixed(decimalCount).slice(2) : '');
      } catch (e) {
        console.log(e);
      }
    }
  }
*/
  public static formatPhone(phoneNumber1): string {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    // reformat phone number
    // 555 123-4567 or (+1) 555 123-4567
    let formatedPhone = phoneNumber1;
    const phoneNumber = FormatUtil.removePhoneFormat(phoneNumber1);
    if (phoneNumber.length === 10) {
      const USNumber = phoneNumber.match(/(\d{3})(\d{3})(\d{4})/);
      formatedPhone =  `${USNumber[1]} ${USNumber[2]}-${USNumber[3]}`;
    } else if (phoneNumber.length <= 3 && phoneNumber.length > 0) {
      formatedPhone = phoneNumber;
    } else if (phoneNumber.length > 3 && phoneNumber.length < 7) {
      formatedPhone = `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, phoneNumber.length)}`;
    } else if (phoneNumber.length >= 7 && phoneNumber.length < 10) {
      formatedPhone = `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length)}`;
    } else if (phoneNumber.length >= 11) {
      const l = phoneNumber.length;
      formatedPhone = `${phoneNumber.substring(0, l - 7)} ${phoneNumber.substring(l - 7, l - 4)}-${phoneNumber.substring(l - 4, l)}`;
      // formatedPhone = `(+${phoneNumber.charAt(0)}) ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, phoneNumber.length - 1)}`;
    }
    return formatedPhone;
  }

  public static formatFax(phoneNumber1): string {
    if (!phoneNumber1) {
      return phoneNumber1;
    }
    // reformat phone number
    // 035-456745 or 02-1234567
    let formatedPhone = phoneNumber1;
    const phoneNumber = FormatUtil.removePhoneFormat(phoneNumber1);
    const l = phoneNumber.length;
    if (l <= 6) {
      formatedPhone = phoneNumber;
    } else if (l <= 9) {
      formatedPhone = `${phoneNumber.substring(0, l - 6)}-${phoneNumber.substring(l - 6, l)}`;
    } else {
      formatedPhone = `${phoneNumber.substring(0, l - 9)}-${phoneNumber.substring(l - 9, l - 6)}-${phoneNumber.substring(l - 6, l)}`;
    }
    /*
    if (phoneNumber.substring(0, 2) !== '02' && phoneNumber.length > 4) {
      formatedPhone = `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, phoneNumber.length)}`;
    } else if (phoneNumber.substring(0, 2) === '02' && phoneNumber.length > 2) {
      formatedPhone = `${phoneNumber.substring(0, 2)}-${phoneNumber.substring(2, phoneNumber.length)}`;
    } else {
      formatedPhone = phoneNumber;
    }*/
    return formatedPhone;
  }

  public static nextNumber(val) {
    if (isNaN(val)) {
      return val;
    }
    const length = val.length;
    let num = (parseFloat(val) + 1) + '';
    while (num.length <= length) {
      num = '0' + num;
    }
    return num;
  }

  public static padLeft(str, length, pad) {
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
      str2 = pad + str2;
    }
    return str2;
  }

  public static padRight(str, length, pad) {
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

  public static removeUniCode(str: string): string {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|$|_/g, '-');
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/-+-/g, '-'); // thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, '');
    // cắt bỏ ký tự - ở đầu và cuối chuỗi
    return str;
  }

  public static removeLocal(str: string): string {
    return str.replace(',', '.');
  }
}
