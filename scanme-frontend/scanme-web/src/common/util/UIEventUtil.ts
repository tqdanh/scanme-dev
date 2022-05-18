import {ResourceManager} from '../ResourceManager';
import {FormatUtil} from './FormatUtil';
import {NumberUtil} from './NumberUtil';
import {StringUtil} from './StringUtil';
import {UIFormatterUtil} from './UIFormatterUtil';
import {UIUtil} from './UIUtil';
import {UIValidationUtil} from './UIValidationUtil';
import {ValidationUtil} from './ValidationUtil';

export class UIEventUtil {
  private static specialCharacters = '<>=[]';
  private static isOnkeyPress = false;
  private static isOnblur = false;
  private static _ddreg = /\d/;
  private static _dreg = /\.|-/g;
  private static _nreg = / |,|\$|\€|\£|¥/g;
  private static _preg = / |,|%|\$|\€|\£|¥/g;

  public static meaningfulTextOnKeyPress(e) {
    if (UIEventUtil.isOnkeyPress) {
      UIEventUtil.isOnkeyPress = false;
      return false;
    }

    if (UIEventUtil.detectCtrlKeyCombination(e)) {
      return true;
    }

    const key = e ? e.keyCode : e.which;
    // up/down
    /*
     if (key === 38) {
     }
     else if (key === 40) {
     }*/
    const control = e.srcElement;
    const keychar = String.fromCharCode(key);
    if (!UIEventUtil.isSpecialCharacter(keychar)) {
      return key;
    } else {
      return UIEventUtil._ddreg.test(keychar);
    }
  }

  private static isSpecialCharacter(c) {
    const length = UIEventUtil.specialCharacters.length;
    for (let i = 0; i < length; i++) {
      const s = UIEventUtil.specialCharacters.charAt(i);
      if (s === c) {
        return true;
      }
    }
    return false;
  }

  public static digitOnKeyPress(e) {
    // const key = window.event ? e.charCode : e.which;
    const keychar = e.key;
    const keycode = e.keyCode || e.charCode;
    const target = e.currentTarget;
    const value = target.value;
    if (UIEventUtil._ddreg.test(keychar)) {
      target.value = value + keychar;
    } else if (keycode === 8 || keycode === 46) {
      target.value = value.slice(0, -1);
    }
  }

  public static digitAndSlashOnKeyPress(e) {
    const key = e ? e.charCode : e.which;
    const keychar = e.key;
    const value = e.currentTarget.value;
    if (UIEventUtil._ddreg.test(keychar) || key === 47) {
      e.currentTarget.value = value + e.key;
    } else if (e.which === 8) {
      e.currentTarget.value = value.substring(0, value.length - 1);
    }
  }

  public static integerOnKeyPress(e) {
    if (UIEventUtil.isOnkeyPress) {
      UIEventUtil.isOnkeyPress = false;
      return false;
    }
    if (UIEventUtil.detectCtrlKeyCombination(e)) {
      return true;
    }

    const key = e ? e.keyCode : e.which;
    // up/down
    /*
     if (key === 38) {
     }
     else if (key === 40) {
     }*/
    const control = e.srcElement;
    const keychar = String.fromCharCode(key);
    let min = control.getAttribute('min');
    if (!min) {
      min = control.getAttribute('greater-than');
    }
    if (!isNaN(min)) {
      min = parseInt(min, null);
    }
    if (min >= 0) {
      if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t') {
        return key;
      }
    } else {
      if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t' || keychar === '-') {
        return key;
      }
    }
    // if(key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t' || keychar === ',') {
    return UIEventUtil._ddreg.test(keychar);
  }
  public static unumberOnKeyPress(e) {
    const key = e ? e.charCode : e.which;
    const keychar = e.key;
    const value = e.currentTarget.value;
    if (UIEventUtil._ddreg.test(keychar) || key === 46) {
      e.currentTarget.value = value + e.key;
    } else if (e.which === 8) {
      e.currentTarget.value = value.substring(0, value.length - 1);
    }
  }
  public static numberOnKeyPress(e) {
    if (UIEventUtil.isOnkeyPress) {
      UIEventUtil.isOnkeyPress = false;
      return false;
    }

    if (UIEventUtil.detectCtrlKeyCombination(e)) {
      return true;
    }

    const key = e ? e.keyCode : e.which;
    const keychar = String.fromCharCode(key);
    let scale = -1;
    const control = e.srcElement;
    let min = control.getAttribute('min');
    if (!min) {
      min = control.getAttribute('greater-than');
    }
    const numFormat = control.getAttribute('number-format');
    if (numFormat != null && numFormat.length > 0) {
      if (numFormat.indexOf('number') === 0) {
        const strNums = numFormat.split(':');
        if (strNums.length > 0 && UIEventUtil.isULong(strNums[1])) {
          scale = parseInt(strNums[1], null);
        }
      }
    }
    if (!isNaN(min)) {
      if (scale === 0) {
        min = parseInt(min, null);
      } else {
        min = parseFloat(min);
      }
    }
    if (scale === 0) {
      if (min >= 0) {
        if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t') {
          return key;
        }
      } else {
        if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t' || keychar === '-') {
          return key;
        }
      }
    } else {
      if (min >= 0) {
        if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t') {
          return key;
        }
      } else {
        if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t' || keychar === '-') {
          return key;
        }
      }
      if (keychar === '.') {
        const str = control.value;
        if (str !== '' && str.indexOf('.') < 0) {
          return key;
        }
      }
    }
    return UIEventUtil._ddreg.test(keychar);
  }

  private static isULong(value): boolean {
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

  public static dateOnKeyPress(e) {
    if (UIEventUtil.isOnkeyPress) {
      UIEventUtil.isOnkeyPress = false;
      return false;
    }

    if (UIEventUtil.detectCtrlKeyCombination(e)) {
      return true;
    }

    const key = e ? e.keyCode : e.which;
    const keychar = String.fromCharCode(key);
    const scale = -1;
    const control = e.srcElement;
    let dateFormat = control.getAttribute('date-format');
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = control.getAttribute('uib-datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = control.getAttribute('datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0 || dateFormat.indexOf('MMM') >= 0 || dateFormat.indexOf('{{') >= 0) {
      return key;
    }

    let chr = null;
    if (dateFormat.indexOf('/') >= 0) {
      chr = '/';
    } else if (dateFormat.indexOf('-') >= 0) {
      chr = '-';
    } else if (dateFormat.indexOf('.') >= 0) {
      chr = '.';
    }

    if (!chr) {
      if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t') {
        return key;
      }
    } else {
      if (key === 13 || key === 8 || key === 9 || key === 11 || key === 127 || key === '\t' || keychar === chr) {
        return key;
      }
    }
    return UIEventUtil._dreg.test(keychar);
  }

  // detect Ctrl + [a, v, c, x]
  private static detectCtrlKeyCombination(e) {
    // list all CTRL + key combinations
    const forbiddenKeys = new Array('v', 'a', 'x', 'c');
    let key;
    let isCtrl;
    const browser = navigator.appName;

    if (browser === 'Microsoft Internet Explorer') {
      key = e.keyCode;
      // IE
      if (e.ctrlKey) {
        isCtrl = true;
      } else {
        isCtrl = false;
      }
    } else {
      if (browser === 'Netscape') {
        key = e.which;
        // firefox, Netscape
        if (e.ctrlKey) {
          isCtrl = true;
        } else {
          isCtrl = false;
        }
      } else {
        return true;
      }
    }

    // if ctrl is pressed check if other key is in forbidenKeys array
    if (isCtrl) {
      const chr = String.fromCharCode(key).toLowerCase();
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < forbiddenKeys.length; i++) {
        if (forbiddenKeys[i] === chr) {
          return true;
        }
      }
    }
    return false;
  }
  public static materialOnFocus = (event) => {
    const control = event.currentTarget;
    if (control.disable || control.readOnly) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      if (control.nodeName === 'INPUT' || control.nodeName === 'SELECT'
        || control.classList.contains('form-control')
        || control.parentElement.classList.contains('form-control')) {
        const container = UIUtil.getControlContainer(control);
        if (container && !container.classList.contains('focused')) {
          container.classList.add('focused');
        }
      }
    }, 0);
  }

  public static handleMaterialFocus(control) {
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      if (control.nodeName === 'INPUT' || control.nodeName === 'SELECT'
        || control.classList.contains('form-control')
        || control.parentElement.classList.contains('form-control')) {
        const container = UIUtil.getControlContainer(control);
        const disableHighlightFocus = control.getAttribute('disable-style-on-focus');
        if (container && !container.classList.contains('focused') && !disableHighlightFocus) {
          container.classList.add('focused');
        }
      }
    }, 0);
  }

  public static initMaterial(form) {
    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < form.length; j++) {
      const control = form[j];
      if (control.nodeName === 'INPUT' || control.nodeName === 'SELECT') {
        let type = control.getAttribute('type');
        if (type != null) {
          type = type.toLowerCase();
        }
        if (control.nodeName === 'INPUT'
          && (type === 'checkbox'
            || type === 'radio'
            || type === 'submit'
            || type === 'button'
            || type === 'reset')) {
          continue;
        } else {
          const parent = control.parentElement;
          const required = control.getAttribute('required');
          if (parent && parent.nodeName === 'LABEL'
              // tslint:disable-next-line:triple-equals
              && required != null && required !== undefined && required != 'false'
              && !parent.classList.contains('required')) {
            parent.classList.add('required');
          } else if (parent.classList.contains('form-group')) {
            const firstChild = parent.firstChild;
            if (firstChild.nodeName === 'LABEL') {
              if (!firstChild.classList.contains('required')) {
                firstChild.classList.add('required');
              }
            }
          }
          if (control.getAttribute('onblur') === null && control.getAttribute('(blur)') === null) {
            control.onblur = UIEventUtil.materialOnBlur;
          } else {
            // console.log('name:' + control.getAttribute('name'));
          }
          if (control.getAttribute('onfocus') === null && control.getAttribute('(focus)') === null) {
            control.onfocus = UIEventUtil.materialOnFocus;
          } else {
            // console.log('name:' + control.getAttribute('name'));
          }
        }
      }
    }
  }

  public static materialOnBlur = (event) => {
    const control = event.currentTarget;
    UIEventUtil.handleMaterialBlur(control);
  }

  public static handleMaterialBlur(control) {
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      if (control.nodeName === 'INPUT' || control.nodeName === 'SELECT'
        || control.classList.contains('form-control')
        || control.parentElement.classList.contains('form-control')) {
        const container = UIUtil.getControlContainer(control);
        if (container) {
          container.classList.remove('focused');
        }
      }
    }, 0);
  }

  public static numberOnFocus(event) {
    const control = event.currentTarget;
    UIEventUtil.handleMaterialFocus(control);
    if (control.readOnly || control.disabled || control.value.length === 0) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIFormatterUtil.removeNumberFormat(control);
    }, 0);
  }

  public static currencyOnFocus(event, self?: any) {
    const ctrl = event.target;
    const datatype = ctrl.getAttribute('data-type');
    UIEventUtil.handleMaterialFocus(ctrl);
    if (ctrl.readOnly || ctrl.disabled || ctrl.value.length === 0) {
      return;
    } else {
      let { value } = ctrl;
      const decimalSeparator = '.';
      const splitArr = value.split(decimalSeparator);
      const valueBeforeDot = datatype === 'currency' ? splitArr[0].replace(/,/g, '') : splitArr[0];

      if (splitArr[1] && Number(splitArr[1]) > 0) {
        value = `${valueBeforeDot}.${splitArr[1]}`;
      } else {
        value = valueBeforeDot;
      }
      ctrl.value = value;
      if (self) {
        self.updateState(event);
      }
    }
  }

  public static percentageOnFocus(event) {
    const control = event.currentTarget;
    UIEventUtil.handleMaterialFocus(control);
    if (control.readOnly || control.disabled || control.value.length === 0) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIFormatterUtil.removePercentageFormat(control);
    }, 0);
  }

  public static numberOnBlur(event) {
    const ctrl = event.currentTarget;
    UIEventUtil.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIValidationUtil.removeErrorMessage(ctrl);
      let value = ctrl.value;
      value = value.replace(UIEventUtil._nreg, '');
      if (value === '') {
        UIUtil.trim(ctrl);
      } else {
        const n = parseFloat(value);
        if (isNaN(value)) {
          ctrl.value = '';
        } else {
          const n2 = UIEventUtil.handleMinMaxInteger(ctrl, n);
          const r = UIEventUtil._formatNumber(ctrl, n2);
          if (r !== ctrl.value) {
            ctrl.value = r;
          }
        }
      }
    }, 0);
  }

  public static percentageOnBlur(event) {
    const ctrl = event.currentTarget;
    UIEventUtil.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIValidationUtil.removeErrorMessage(ctrl);
      let value = ctrl.value;
      value = value.replace(UIEventUtil._preg, '');
      if (value === '') {
        UIUtil.trim(ctrl);
      } else {
        const n = parseFloat(value);
        if (isNaN(value)) {
          ctrl.value = '';
        } else {
          const n2 = UIEventUtil.handleMinMaxInteger(ctrl, n);
          const r = UIEventUtil._formatNumber(ctrl, n2) + '%';
          if (r !== ctrl.value) {
            ctrl.value = r;
          }
        }
      }
    }, 0);
  }

  public static currencyOnBlur(event) {
    const ctrl = event.currentTarget;
    UIEventUtil.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIValidationUtil.removeErrorMessage(ctrl);
      let value = ctrl.value;
      value = value.replace(UIEventUtil._nreg, '');
      if (value === '') {
        UIUtil.trim(ctrl);
      } else {
        const n = parseFloat(value);
        if (isNaN(value)) {
          ctrl.value = '';
        } else {
          const n2 = UIEventUtil.handleMinMaxInteger(ctrl, n);
          const r = UIEventUtil._formatNumber(ctrl, n2) + '$';
          if (r !== ctrl.value) {
            ctrl.value = r;
          }
        }
      }
    }, 0);
  }

  private static handleMinMaxInteger(ctrl, num: number) {
    let n = num;
    let max = ctrl.getAttribute('max');
    if (!max) {
      max = ctrl.getAttribute('ng-max');
    }
    if (max !== null && max.length > 0) {
      max = parseFloat(max);
      if (n > max) {
        n = max;
      }
    }
    let min = ctrl.getAttribute('min');
    if (!min) {
      min = ctrl.getAttribute('ng-min');
    }
    if (min !== null && min.length > 0) {
      min = parseFloat(min);
      if (n < min) {
        n = min;
      }
    }
    if (ctrl.getAttribute('data-type') === 'int') {
      n = parseInt(n.toFixed(0), null);
    }
    return n;
  }

  private static _formatNumber(ctrl, v): string {
    const numFormat = ctrl.getAttribute('number-format');
    if (numFormat !== null) {
      if (numFormat.indexOf('number') === 0) {
        const strNums = numFormat.split(':');
        if (strNums.length > 0 && UIEventUtil.isULong(strNums[1])) {
          const scale = parseInt(strNums[1], null);
          return NumberUtil.formatNumber(v, scale);
        } else {
          return v;
        }
      } else {
        return NumberUtil.format(v, numFormat);
      }
    } else {
      return v;
    }
  }

  public static emailOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      if (value.length > 0 && !ValidationUtil.isEmail(value)) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_email'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
      }
    }, 40);
  }

  public static validOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
  }

  public static validatePhoneOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled || !ctrl.value) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = FormatUtil.removePhoneFormat(ctrl.value);
      if (value.length !== 9) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_phone'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl);
      }
    }, 40);
  }

  public static validateFaxOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled || !ctrl.value) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = FormatUtil.removePhoneFormat(ctrl.value);
      if (value.length < 9 || value.length > 10) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_fax'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl);
      }
    }, 40);
  }

  /**
   * Check required by attribute, then check if this input is an valid email.
   */
  public static checkPatternOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      let required = ctrl.getAttribute('config-required');
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('required');
      }
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('ng-required');
      }
      const label = UIUtil.getLabel(ctrl);
      if (required !== null && required !== 'false') {
        if (value.length === 0) {
          const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          let pattern = ctrl.getAttribute('config-pattern');
          const patternModifier = ctrl.getAttribute('config-pattern-modifier');
          if (pattern == null || pattern === undefined) {
            pattern = ctrl.getAttribute('pattern');
          }
          if (pattern) {
            const resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
            if (!ValidationUtil.isValidPattern(pattern, patternModifier, value)) {
              const msg = StringUtil.format(ResourceManager.getString(resource_key), label);
              UIValidationUtil.addErrorMessage(ctrl, msg);
              return false;
            } else {
              UIValidationUtil.removeErrorMessage(ctrl);
            }
          } else {
            UIValidationUtil.removeErrorMessage(ctrl);
          }
        }
      }
    }, 40);
  }

  /**
   * Check required by attribute, then check if this input is an valid email.
   */
  public static checkEmailOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      let required = ctrl.getAttribute('config-required');
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('required');
      }
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('ng-required');
      }
      const label = UIUtil.getLabel(ctrl);
      if (required !== null && required !== 'false') {
        if (value.length === 0) {
          const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else if (!ValidationUtil.isEmail(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_email'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      } else {
        if (value.length > 0 && !ValidationUtil.isEmail(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_email'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      }
    }, 40);
  }


  public static checkCurrencyOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    this.materialOnBlur(event);
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      const value2 = value.replace(UIEventUtil._nreg, '');
      let required = ctrl.getAttribute('config-required');
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('required');
      }
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('ng-required');
      }
      const label = UIUtil.getLabel(ctrl);
      if (required !== null && required !== 'false') {
        if (value.length === 0) {
          const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else if (isNaN(value2)) {
          const msg = StringUtil.format(ResourceManager.getString('error_number'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          if (UIEventUtil.validateMinMax(ctrl, value2, label)) {
            UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
          }
        }
      } else {
        if (value.length > 0 && isNaN(value2)) {
          const msg = StringUtil.format(ResourceManager.getString('error_number'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          if (UIEventUtil.validateMinMax(ctrl, value2, label)) {
            UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
          }
        }
      }
    }, 40);
  }

  private static validateMinMax(ctrl, value: string, label: string): boolean {
    const n = parseFloat(value);
    let min = ctrl.getAttribute('min');
    if (!min) {
      min = ctrl.getAttribute('ng-min');
    }
    if (min !== null && min.length > 0) {
      min = parseFloat(min);
      if (n < min) {
        let msg = StringUtil.format(ResourceManager.getString('error_min'), label, min);
        let maxd = ctrl.getAttribute('max');
        if (!maxd) {
          maxd = ctrl.getAttribute('ng-max');
        }
        if (maxd !== null && maxd.length > 0) {
          maxd = parseFloat(maxd);
          if (maxd === 1 && min === 1) {
            msg = StringUtil.format(ResourceManager.getString('error_maxmin1'), label, maxd);
          }
        }
        UIValidationUtil.addErrorMessage(ctrl, msg);
        return false;
      }
    }
    let max = ctrl.getAttribute('max');
    if (!max) {
      max = ctrl.getAttribute('ng-max');
    }
    if (max !== null && max.length > 0) {
      max = parseFloat(max);
      if (n > max) {
        let msg = StringUtil.format(ResourceManager.getString('error_max'), label, max);
        if (min !== null && max === 1 && min === 1) {
          msg = StringUtil.format(ResourceManager.getString('error_maxmin1'), label);
        }
        UIValidationUtil.addErrorMessage(ctrl, msg);
        return false;
      }
    }
    const minField = ctrl.getAttribute('min-field');
      if (minField) {
      const form = ctrl.form;
      if (form) {
        const ctrl2 = UIUtil.getControlFromForm(form, minField);
        if (ctrl2) {
          const smin2 = ctrl2.value.replace(this._nreg, '');
          if (smin2.length > 0 && !isNaN(smin2)) {
            const min2 = parseFloat(smin2);
            if (n < min2) {
              const minLabel = UIUtil.getLabel(ctrl2);
              const msg = StringUtil.format(ResourceManager.getString('error_min'), label, minLabel);
              UIValidationUtil.addErrorMessage(ctrl, msg);
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  public static checkUrlOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      let required = ctrl.getAttribute('config-required');
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('required');
      }
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('ng-required');
      }
      const label = UIUtil.getLabel(ctrl);
      if (required !== null && required !== 'false') {
        if (value.length === 0) {
          const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else if (!ValidationUtil.isValidURL(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_url'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      } else {
        if (value.length > 0 && !ValidationUtil.isValidURL(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_url'), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      }
    }, 40);
  }

  public static requiredEmailOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      if (value.length === 0) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else if (!ValidationUtil.isEmail(value)) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_email'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
      }
    }, 40);
  }

  public static requiredOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    UIValidationUtil.removeErrorMessage(ctrl);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      if (value.length === 0) {
        const label = UIUtil.getLabel(ctrl);
        const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
        UIValidationUtil.addErrorMessage(ctrl, msg);
      } else {
        UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
      }
    }, 40);
  }

  /**
   * Check required by attribute
   */
  public static checkRequiredOnBlur(event) {
    const ctrl = event.currentTarget;
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      const value = ctrl.value;
      let required = ctrl.getAttribute('config-required');
      if (required == null || required === undefined) {
        required = ctrl.getAttribute('required');
      }
      if (required !== null && required !== 'false') {
        if (value.length === 0) {
          const label = UIUtil.getLabel(ctrl);
          const errorKey = (ctrl.nodeName === 'SELECT' ? 'error_select_required' : 'error_required');
          const msg = StringUtil.format(ResourceManager.getString(errorKey), label);
          UIValidationUtil.addErrorMessage(ctrl, msg);
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      } else {
        UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
      }
    }, 40);
  }

  public static validateOnBlur(event) {
    const ctrl = event.currentTarget;
    UIEventUtil.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIUtil.trim(ctrl);
      UIValidationUtil.removeErrorMessage(ctrl);
      const valid = UIValidationUtil.validateControl(ctrl);
      if (ctrl.value.length > 0 && valid) {
        UIFormatterUtil.formatControl(ctrl);
      }
    }, 0);
  }

  public static dateOnBlur(event) {
    const ctrl = event.currentTarget;
    UIEventUtil.handleMaterialBlur(event);
    if (!ctrl || ctrl.readOnly || ctrl.disabled) {
      return;
    }
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIValidationUtil.removeErrorMessage(ctrl);
      const v = ctrl.value;
      const v2 = UIEventUtil.reformatDate(ctrl);
      if (v2 !== '' && v2 !== v) {
        ctrl.value = v2;
      }
    }, 0);
  }

  private static reformatDate(control): string {
    let str = control.value;
    if (str.length === 0 || UIEventUtil.trimText(str) === '') {
      return '';
    }

    let dateFormat = control.getAttribute('date-format');

    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = control.getAttribute('uib-datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      dateFormat = control.getAttribute('datepicker-popup');
    }
    if (!dateFormat || dateFormat.length === 0) {
      return '';
    }
    dateFormat = dateFormat.toUpperCase();
    if (dateFormat.indexOf('MMM') >= 0) {
      return '';
    }
    const monthIndex = dateFormat.indexOf('MM');
    const dayIndex = dateFormat.indexOf('DD');
    const yearIndex = dateFormat.indexOf('YY');
    if (monthIndex < 0 || dayIndex < 0 || yearIndex < 0) {
      return '';
    }
    let chr = '/';
    if (dateFormat.indexOf('/') >= 0) {
      chr = '/';
    } else if (dateFormat.indexOf('-') >= 0) {
      chr = '-';
    } else if (dateFormat.indexOf('.') >= 0) {
      chr = '.';
    } else {
      return '';
    }

    if (str.indexOf('/') < 0 && str.indexOf('-') < 0 && str.indexOf('.') < 0) {
      if (str.length === 6) {
        str = '' + str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 6);
      } else if (str.length === 8) {
        if (yearIndex < monthIndex && yearIndex < dayIndex) {
          str = '' + str.substring(0, 4) + '/' + str.substring(4, 6) + '/' + str.substring(6, 8);
        } else if (yearIndex > monthIndex && yearIndex > dayIndex) {
          str = '' + str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 8);
        } else {
          str = '' + str.substring(0, 2) + '/' + str.substring(2, 6) + '/' + str.substring(6, 8);
        }
      } else {
        return '';
      }
    }

    str = str.replace(UIEventUtil._dreg, '/');

    const date_split = str.split('/');

    if (date_split.length !== 3) {
      return '';
    }

    let str2 = date_split[2];
    let str1 = date_split[1];
    let str0 = date_split[0];

    if (str0.length === 1) {
      str0 = '0' + str0;
    } else if (str0.length === 0) {
      str0 = '01';
    }
    if (str1.length === 1) {
      str1 = '0' + str1;
    } else if (str1.length === 0) {
      str1 = '01';
    }
    if (str2.length === 1) {
      str2 = '0' + str2;
    } else if (str2.length === 0) {
      str2 = '01';
    }
    if (yearIndex > monthIndex && yearIndex > dayIndex) {
      if (str2.length === 2) {
        str2 = '20' + str2;
      } else if (str2.length === 3) {
        str2 = '2' + str2;
      }
      if (str0.length > 3) {
        str0 = str0.substring(0, 2);
      }
      if (str1.length > 3) {
        str1 = str1.substring(0, 2);
      }
    } else if (yearIndex < monthIndex && yearIndex < dayIndex) {
      if (str0.length === 2) {
        str0 = '20' + str0;
      } else if (str2.length === 3) {
        str0 = '2' + str0;
      }
      if (str1.length > 3) {
        str1 = str1.substring(0, 2);
      }
      if (str2.length > 3) {
        str2 = str2.substring(0, 2);
      }
    } else {
      if (str1.length === 2) {
        str1 = '20' + str1;
      } else if (str2.length === 3) {
        str1 = '2' + str1;
      }
      if (str0.length > 3) {
        str0 = str0.substring(0, 2);
      }
      if (str2.length > 3) {
        str2 = str2.substring(0, 2);
      }
    }

    if (isNaN(str0) || isNaN(str1) || isNaN(str2)) {
      return '';
    }
    const strDate = '' + str0 + chr + str1 + chr + str2;

    const day = parseInt(strDate.substring(dayIndex, dayIndex + 2), 10);
    const month = parseInt(strDate.substring(monthIndex, monthIndex + 2), 10);
    const year = parseInt(strDate.substring(yearIndex, yearIndex + 4), 10);

    const date = new Date(year, month - 1, day);

    if (date.getDate() !== day
      || date.getMonth() !== (month - 1)
      || date.getFullYear() !== year) {
      return '';
    } else {
      return strDate;
    }
  }

  private static trimText(s) {
    if (s === null || s === undefined) {
      return;
    }
    s = s.trim();
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
