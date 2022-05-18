export class StringUtil {
    public static uuid(uuid): string {
        return StringUtil.replaceAll(uuid(), '-', '');
    }

    public static replaceAll(value: string, strFind: string, strReplace: string): string {
        let str = value;
        while (str.indexOf(strFind) >= 0) {
            str = str.replace(strFind, strReplace);
        }
        return str;
    }

    public static param(obj: any): string {
        const keys = Object.keys(obj);
        const arrs = [];
        for (let i = 0; i < keys.length; i++) {
            const str = encodeURIComponent(keys[i]) + '=' + encodeURIComponent(obj[keys[i]]);
            arrs.push(str);
        }
        return arrs.join('&');
    }

    public static trim(s: string): string {
        if (!s) {
            return;
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


    public static encodeHtml(str: string): string {
        return str;
    }

    public static indexOf(arrs, str, keyValue, ignoreCase: boolean): number {
        if (!arrs || arrs.length === 0) {
            return -1;
        }
        for (let i = 0; i < arrs.length; i++) {
            let valueArray = arrs[i];

            if (keyValue && keyValue.length) {
                valueArray = arrs[i][keyValue];
            }

            if (ignoreCase === true) {
                if (valueArray.toUpperCase() === str.toUpperCase()) {
                    return i;
                }
            } else {
                if (valueArray === str) {
                    return i;
                }
            }
        }
        return -1;
    }

    public static isEmpty(str: string): boolean {
        return (!str || str === '');
    }

    public static toLowerCase(str: string): string {
        return (!str || str === '' ? str : str.toLowerCase());
    }

    public static toUpperCase(str: string): string {
        return (!str || str === '' ? str : str.toUpperCase());
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

    public static stringToCodePoint(str: string) {
        let resultUnicodePoint = '';
        for (let i = 0; i < str.length; i++) {
            const hex = str.charCodeAt(i).toString(16).toUpperCase();
            const s = str.charAt(i);
            if (this.isNonLatinCharacters(s)) {
                resultUnicodePoint += '\\u' + '0000'.substring(0, 4 - hex.length) + hex;
            } else {
                resultUnicodePoint += s;
            }
        }
        return resultUnicodePoint;
    }

    public static isNonLatinCharacters(s) {
        return /[^\u0000-\u007F]/.test(s);
    }

    public static format(...args: any[]): string {
        let formatted = args[0];
        if (StringUtil.isEmpty(formatted)) {
            return '';
        }
        if (args.length > 1 && Array.isArray(args[1])) {
            const params = args[1];
            for (let i = 0; i < params.length; i++) {
                const regexp = new RegExp('\\{' + i + '\\}', 'gi');
                formatted = formatted.replace(regexp, params[i]);
            }
        } else {
            for (let i = 1; i < args.length; i++) {
                const regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
                formatted = formatted.replace(regexp, args[i]);
            }
        }
        return formatted;
    }

    public static removePhoneFormat(phone: string): string {
        if (!phone) {
            return phone;
        } else {
            return phone.replace(/ |\+|\-|\.|\(|\)/g, '');
        }
    }

    public static formatPhone(phoneNumber1): string {
        if (!phoneNumber1) {
            return phoneNumber1;
        }
        // reformat phone number
        // (555) 123-4567 or +1 (555) 123-4567
        let formatedPhone = phoneNumber1;
        const phoneNumber = StringUtil.removePhoneFormat(phoneNumber1);
        if (phoneNumber.length === 10) {
            const USNumber = phoneNumber.match(/(\d{3})(\d{3})(\d{4})/);
            formatedPhone = '(' + USNumber[1] + ') ' + USNumber[2] + '-' + USNumber[3];
        } else if (phoneNumber.length === 11) {
            const USNumber = phoneNumber.match(/(\d{1})(\d{3})(\d{3})(\d{4})/);
            formatedPhone = '+' + USNumber[1] + ' (' + USNumber[2] + ') ' + USNumber[3] + '-' + USNumber[4];
        }
        return formatedPhone;
    }

    public static trimBreakLine(value): string {
        if (!value) {
            return value;
        }
        value = value.replaceAll('\r\n', '');
        value = value.replaceAll('\r', '');
        value = value.replaceAll('\n', '');
        value = value.replaceAll('\t', '');
        return value;
    }

    public static padLeft(str: string, length: number, pad?: string) {
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
        /* find and replace all special character wit '-' */
        str = str.replace(/-+-/g, '-'); // replace 2 '-' by 1 '-'
        str = str.replace(/^\-+|\-+$/g, ''); // trim '-' at start of string and end of string
        return str;
    }

    public static removeLocal(str: string): string {
        return str.replace(',', '.');
    }

    public static htmlBinding(str: string): string {
        if (!!str) {
            return str.split('\n').join('<br />');
        }
        return str;
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

    public static getMax(array): any {
        return Math.max.apply(Math, array);
    }

    /* tslint:disable */
    private static _reg1 = /([A-Z])/g;
    private static _reg2 = /^./;

    public static camelCaseToHuman(arg: string) {
        if (arg) {
            return arg
                .replace(this._reg1, ' $1') // insert a space before all caps
                .replace(this._reg2, function (str) {
                    return str.toUpperCase();
                }); // uppercase the first character
        } else {
            return '';
        }
    }

    private static _urlRegExp = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

    public static isValidURL(url: string): boolean {
        return this._urlRegExp.test(url);

    }

    private static _intRegex = /^\d+$/;

    public static isInteger(a): boolean {
        return this._intRegex.test(a);
    }

    private static _percentRegex = /^[1-9][0-9]?$|^100$/;

    public static isPercentage(a): boolean {
        return this._percentRegex.test(a);
    }

    private static _digitRegExp = /^\d+$/;

    public static isDigitOnly(str: string): boolean {
        return this._digitRegExp.test(str);
    }

    private static _numberAndDashRegExp = /^[0-9-]*$/;

    public static isDigitAndDashOnly(stringRoutingNumber: string): boolean {
        return this._numberAndDashRegExp.test(stringRoutingNumber);
    }

    private static _emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    public static isEmail(email: string): boolean {
        return this._emailReg.test(email);
    }

    private static _phoneRegex = /^[1]?[-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    private static _phoneRegex2 = /^[+][1][-. ]?(\(?([0-9]{3})\)?)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    public static isPhone(str: string): boolean {
        // const intRegex = /^[1]?([0-9]{3})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // Ed. With optional brackets (actually parenthesis) for area code (untested):
        return this._phoneRegex.test(str) || this._phoneRegex2.test(str);
    }

    public static isPhoneNumber(phoneNumber: string): boolean {
        if (phoneNumber == null || phoneNumber.length == 0)
            return false;
        return this.isDigitOnly(phoneNumber);
    }

    private static _creg = / |,|\$|\€|\£|\£|¥/g;

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

    private static _passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

    public static isValidPassword(password: string): boolean {
        return this._passwordRegex.test(password);
    }

    /*
      private static _urlReg = /^(ftp|https?):\/\/+(www\.)?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?/i;
      public static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
      },
    
      private static isUrl(url: string): boolean {
        // let RegExp = //i;
        // return RegExp.test(url);
        return new RegExp('^(https?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.)?([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?', 'i').test(url);
      },
    */
    public static isValidPattern(patternStr: string, value: string): boolean {
        if (!StringUtil.isEmpty(patternStr)) {
            const pattern = new RegExp(patternStr);
            return pattern.test(value);
        } else {
            return false;
        }
    }

    private static _regCheckNumber = /^\d{0,8}$/;

    public static isCheckNumber(stringCheckNumber): boolean {
        return this._regCheckNumber.test(stringCheckNumber);
    }

    private static _regSSNNumber = /^\d+$/;

    public static isStringSSNNumber(stringNumber): boolean {
        return this._regSSNNumber.test(stringNumber);
    }

    private static _regAmountNumber = /^[0-9]{0,15}(?:\.[0-9]{1,3})?$/;

    public static isAmountNumber(amountNumber): boolean {

        return this._regAmountNumber.test(amountNumber);
    }

    private static _regUSPostCode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

    public static isUSPostcode(postalCode): boolean {
        return this._regUSPostCode.test(postalCode);
    }

    private static _regCAPostcode = /^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy][0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][ -]?[0-9][ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvwxyz][0-9]$/; // /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    public static isCAPostcode(postalCode): boolean {
        // For Canada Postal codes do not include the letters D, F, I, O, Q or U, and the first position also does not make use of the letters W or Z.

        return this._regCAPostcode.test(postalCode);
    }
}
