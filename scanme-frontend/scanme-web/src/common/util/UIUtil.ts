import {Locale} from '../locale/model/Locale';
import {ResourceManager} from '../ResourceManager';
import {DateUtil} from './DateUtil';
import {ReflectionUtil} from './ReflectionUtil';
import {StringUtil} from './StringUtil';

let sysToast: any;
let sysAlert: any;
let sysMessage: any;
let sysMessageHeader: any;
let sysErrorDetail: any;
let sysErrorDetailText: any;
let sysYes: any;
let sysNo: any;

const sysLoading: any = {
  style: {
    display: '',
  }
};

// @ts-ignore
const _fyesOnClick: any;
// @ts-ignore
const _fnoOnClick: any;
// @ts-ignore
let sysErrorDetailCaret: any = {
  style: {
    display: ''
  }
};

interface MessagePopupType {
  msg: string;
  header: string;
  detail: string;
  alertType: AlertType;
  iconType: AlertIconType;
  yesCallback?: any;
  noCallback?: any;
  btnLeftText?: string;
  btnRightText?: string;
}

export enum ShowButtonType {
  yesNo = 'yesNO',
  onlyYes = 'onlyYes'
}

export enum AlertIconType {
  Error = 'Error',
  Warning = 'Warning',
  Success = 'Success',
  Info = 'Info',
  Alert = 'Alert'
}

export enum AlertType {
  Confirm = 'Confirm',
  Alert = 'Alert'
}

export class UIUtil {
  private static _nreg = / |,|\$|\€|\£|¥/g;
  private static _creg = / |,|\$|\€|\£|¥/g;
  private static _isInit = false;

  public static init() {
    if (this._isInit === false) {
      sysToast = (window as any).sysToast;
      sysAlert = (window as any).sysAlert;
      sysMessage = (window as any).sysMessage;
      sysMessageHeader = (window as any).sysMessageHeader;
      sysErrorDetail = (window as any).sysErrorDetail;
      sysErrorDetailText = (window as any).sysErrorDetailText;
      sysErrorDetailCaret = (window as any).sysErrorDetailCaret;
      sysYes = (window as any).sysYes;
      sysNo = (window as any).sysNo;

      this._isInit = true;
    }
  }

  public static param(obj: any): string {
    const keys = Object.keys(obj);
    const arrs = [];
    for (const item of keys) {
      const str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
      arrs.push(str);
    }
    return arrs.join('&');
  }

  public static encodeHtml(str: string): string {
    return str;
  }

  public static htmlBinding(str: string): string {
    if (!!str) {
      return str.split('\n').join('<br />');
    }
    return str;
  }

  public static getValue(ctrl, locale?: Locale, eventType?: string): { mustChange: any, value?: any } {
    if (ctrl.type === 'checkbox') {
      const ctrlOnValue = ctrl.getAttribute('data-on-value');
      const ctrlOffValue = ctrl.getAttribute('data-off-value');
      if (ctrlOnValue && ctrlOffValue) {
        const onValue = ctrlOnValue ? ctrlOnValue : true;
        const offValue = ctrlOffValue ? ctrlOffValue : false;
        return ctrl.checked === true ? { mustChange: true, value: onValue } : { mustChange: true, value: offValue };
      } else {
        return ctrl.checked === true ? { mustChange: true, value: true } : { mustChange: true, value: false };
      }
    } else {
      const datatype = ctrl.getAttribute('data-type');
      if (datatype === 'number' || datatype === 'int') {
        const v: any = ctrl.value.replace(this._nreg, '');
        return isNaN(v) ? { mustChange: false } : { mustChange: true, value: parseFloat(v) };
      } else if (datatype === 'currency' || datatype === 'string-currency') {
        const res: any = UIUtil.getStringCurrency(ctrl.value, datatype, locale, ctrl.getAttribute('maxlength'), eventType === 'blur');
        return res;
      } else {
        return { mustChange: true, value: ctrl.value };
      }
    }
  }

  private static getStringCurrency(value: string, datatype: string, locale: Locale, maxLength?: number, isOnBlur?: boolean): { mustChange: any, value?: string } {
    value = value.replace(this._creg, '');
    if (value === '') {
      return { mustChange: true, value: '' };
    }
    value = this.extractNumber(value);
    if (value.length === 0) {
      return { mustChange: false };
    } else if (value.length > 0 && value.charAt(0) === '0') {
      return { mustChange: true, value: value.substring(1) };
    }

    const currencyDecimalDigits = locale ? locale.currencyDecimalDigits : 2;
    const groupDigits = 3; // TODO in database locale don't have data
    const decimalSeparator = '.';
    const thousandsSeparator = ',';

    if (isOnBlur) {
      const number = Number(value.replace(/^0+/, ''));
      if (number === 0) {
        return { mustChange: true, value: '' };
      } else {
        value = number.toFixed(currencyDecimalDigits);
      }
    }

    const dotPosition = value.indexOf(decimalSeparator);
    // Format thousands
    let beforeDot = dotPosition > -1 ? value.substr(0, dotPosition) : value;
    if (datatype === 'string-currency' || isOnBlur) {
      beforeDot = beforeDot.replace(new RegExp('\\B(?=(\\d{' + groupDigits + '})+(?!\\d))', 'g'), thousandsSeparator);
    }

    // Cut after dot
    let afterDot;
    if (dotPosition > 0) {
      afterDot = value.substr(dotPosition + 1);
      if (afterDot.length > currencyDecimalDigits) {
        afterDot = afterDot.substr(0, currencyDecimalDigits);
      }
    }
    if (beforeDot.length > maxLength - (currencyDecimalDigits + 1)) {
      return { mustChange: false };
    }

    value = dotPosition > -1 ? beforeDot + decimalSeparator + afterDot : beforeDot;
    return maxLength && value.length > maxLength ? { mustChange: false } : { mustChange: true, value };
  }

  private static extractNumber(str: string): string {
    const arrs: string[] = [];
    let d = false;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);  // get char
      if (ch >= '0' && ch <= '9') {
        arrs.push(ch);
      } else if (ch === '.') {
        if (d) {
          return arrs.join('');
        } else {
          d = true;
          arrs.push(ch);
        }
      } else {
        return arrs.join('');
      }
    }
    return arrs.join('');
  }

  public static getLabel(input) {
    if (!input || input.getAttribute('type') === 'hidden') {
      return '';
    }
    let label = input.getAttribute('label');
    if (label) {
      return label;
    } else if (!label || label.length === 0) {
      let key = input.getAttribute('key');
      if (!key || key.length === 0) {
        key = input.getAttribute('resource-key');
      }
      if (key !== null && key.length > 0) {
        label = ResourceManager.getString(key);
        input.setAttribute('label', label);
        return label;
      } else {
        return UIUtil.getLabelFromContainer(input);
      }
    } else {
      return UIUtil.getLabelFromContainer(input);
    }
  }

  private static getLabelFromContainer(input) {
    const parent = UIUtil.getControlContainer(input);
    if (parent && parent.nodeName === 'LABEL' && parent.childNodes.length > 0) {
      const first = parent.childNodes[0];
      if (first.nodeType === 3) {
        return first.nodeValue;
      }
    } else if (parent && parent.nodeName !== 'LABEL') {
      if (parent.classList.contains('form-group')) {
        const firstChild = parent.firstChild;
        if (firstChild.nodeName === 'LABEL') {
          return firstChild.innerHTML;
        } else {
          return '';
        }
      } else {
        const node = parent.parentElement;
        if (node && node.nodeName === 'LABEL' && node.childNodes.length > 0) {
          const first = node.childNodes[0];
          if (first.nodeType === 3) {
            return first.nodeValue;
          }
        }
      }
    }
    return '';
  }

  public static confirm(msg, header: string = null, yesCallback: any = null, btnLeftText: any = null, btnRightText: any = null, iconType: any = null, noCallback: any = null) {
    const messageType = {
      msg,
      // showButtonType: ShowButtonType.yesNo,
      header,
      detail: null,
      alertType: AlertType.Confirm,
      iconType,
      yesCallback,
      noCallback,
      btnLeftText,
      btnRightText,
    };
    this.showAlert(messageType);
  }

  public static alertError(msg, header: string = null, detail: string = null, callback: any = null, btnLeftText: any = null, btnRightText: any = null) {
    const messageType = {
      msg,
      // showButtonType: ShowButtonType.onlyYes,
      header,
      detail,
      alertType: AlertType.Alert,
      iconType: AlertIconType.Error,
      yesCallback: callback,
      noCallback: null,
      btnLeftText,
      btnRightText,
    };
    this.showAlert(messageType);
  }

  // @ts-ignore
  public static alertWarning(msg, header: string = null, detail: string = null, callback: any = null, iconType: AlertIconType = null, btnRightText: any = null) {
    const messageType = {
      msg,
      // showButtonType: ShowButtonType.onlyYes,
      header,
      detail,
      alertType: AlertType.Alert,
      iconType,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText,
    };
    this.showAlert(messageType);
  }

  public static alertInfo(msg, header: string = null, callback: any = null, detail: string = null, ) {
    const messageType = {
      msg,
      // showButtonType: ShowButtonType.onlyYes,
      header,
      detail,
      alertType: AlertType.Alert,
      iconType: AlertIconType.Info,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText: null,
    };
    this.showAlert(messageType);
  }

  public static alertSuccess(msg, header: string = null, callback: any = null, detail: string = null) {
    const messageType = {
      msg,
      // showButtonType: ShowButtonType.onlyYes,
      header,
      detail,
      alertType: AlertType.Alert,
      iconType: AlertIconType.Success,
      yesCallback: callback,
      noCallback: null,
      btnLeftText: null,
      btnRightText: null,
    };
    this.showAlert(messageType);
  }

  public static showAlert(messageType: MessagePopupType) {
    const {
      msg,
      header = '',
      detail = null,
      alertType = AlertType.Confirm,
      iconType = null,
      yesCallback = null,
      noCallback = null,
      btnLeftText = '',
      btnRightText = ''
    } = messageType;

    this.init();
    if (alertType === AlertType.Alert) {
      if (!sysAlert.classList.contains('alert-only')) {
        sysAlert.classList.add('alert-only');
      }
    } else {
      sysAlert.classList.remove('alert-only');
    }
    if (sysErrorDetail && sysErrorDetailCaret && sysErrorDetailText) {
      if (!detail) {
        sysErrorDetailCaret.style.display = 'none';
        sysErrorDetail.style.display = 'none';
        sysErrorDetailText.innerHTML = '';
      } else {
        sysErrorDetailCaret.style.display = 'inline-block';
        sysErrorDetail.style.display = 'inline-block';
        sysErrorDetailText.innerHTML = UIUtil.encodeHtml(detail);
      }
    }
    sysMessage.innerHTML = UIUtil.encodeHtml(msg);
    sysMessageHeader.innerHTML = UIUtil.encodeHtml(header);
    if (iconType === AlertIconType.Alert) {
      if (!sysAlert.classList.contains('warning-icon')) {
        sysAlert.classList.add('warning-icon');
      }
      sysAlert.classList.remove('warning-icon');
    } else if (iconType === AlertIconType.Error) {
      if (!sysAlert.classList.contains('danger-icon')) {
        sysAlert.classList.add('danger-icon');
      }
      sysAlert.classList.remove('warning-icon');
    } else {
      sysAlert.classList.remove('danger-icon');
      sysAlert.classList.remove('warning-icon');
    }
    const activeElement = (window as any).document.activeElement;
    sysYes.innerHTML = UIUtil.encodeHtml(btnRightText);
    sysNo.innerHTML = UIUtil.encodeHtml(btnLeftText);
    sysYes['activeElement'] = activeElement;
    sysAlert.style.display = 'flex';
    (window as any).fyesOnClick = yesCallback;
    (window as any).fnoOnClick = noCallback;
    sysYes.focus();
  }

  public static showToast(msg) {
    this.init();
    sysToast.innerHTML = msg;
    const ui = this;
    ui.fadeIn(sysToast);
    setTimeout(() => {
      ui.fadeOut(sysToast);
    }, 1340);
  }

  public static fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
      // tslint:disable-next-line: no-conditional-assignment
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  public static showLoading = (isFirstTime) => {
    try {
      if ((window as any).sysLoading !== undefined) {
        (window as any).sysLoading.style.display = 'block';
        if (isFirstTime) {
          (window as any).sysLoading.classList.add('dark');
        } else {
          (window as any).sysLoading.classList.remove('dark');
        }
      }
    } catch (er) {
      console.log(er);
    }
  }

  public static hideLoading = () => {
    try {
      if ((window as any).sysLoading !== undefined) {
        (window as any).sysLoading.style.display = 'none';
      }
    } catch (er) {
      console.log(er);
    }
  }

  public static fadeIn(el, display = null) {
    el.style.opacity = 0;
    el.style.display = display || 'block';

    (function fade() {
      let val = parseFloat(el.style.opacity);
      val += .1;
      if (!(val > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  public static bindToForm(form, obj) {
    for (const f of form) {
      let ctrl = f;
      if (ctrl.name !== null && ctrl.name !== '') {
        let v = obj[ctrl.name];
        if (v === undefined || v === null) {
          v = null;
        }
        ctrl = v;
      }
    }
  }

  public static decodeFromForm(form): any {
    if (!form) {
      return null;
    }
    const dateFormat = form.getAttribute('date-format');
    const obj = {};
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < form.length; i++) {
      const ctrl = form[i];
      let name = ctrl.getAttribute('name');
      const id = ctrl.getAttribute('id');
      let val;
      let isDate = false;
      if (!name || name.length === 0) {
        let dataField = ctrl.getAttribute('data-field');
        if (!dataField && ctrl.parentElement.classList.contains('DayPickerInput')) {
          dataField = ctrl.parentElement.parentElement.getAttribute('data-field');
          isDate = true;
        }
        name = dataField;
      }
      if (name != null && name.length > 0) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT') {
          switch (type) {
            case 'checkbox':
              if (!!id && name !== id) {
                // obj[name] = !obj[name] ? [] : obj[name];
                val = ReflectionUtil.valueOf(obj, name); // val = obj[name];
                if (!val) {
                  val = [];
                }
                if (ctrl.checked) {
                  val.push(ctrl.value);
                  // obj[name].push(ctrl.value);
                } else {
                  // tslint:disable-next-line: triple-equals
                  val = val.filter(item => item != ctrl.value);
                }
              } else {
                if (ctrl.checked === 'checked') {
                  val = true;
                }
              }
              break;
            case 'radio':
              if (ctrl.checked === 'checked') {
                val = ctrl.value;
              }
              break;
            case 'date':
              if (ctrl.value.length === 10) {
                try {
                  val = DateUtil.parse(ctrl.value, 'YYYY-MM-DD');
                } catch (err) {
                  val = null;
                }
              } else {
                val = null;
              }
              break;
            default:
              val = ctrl.value;
          }
          if (isDate && dateFormat) {
            try {
              val = DateUtil.parse(val, dateFormat);
            } catch (err) {
              val = null;
            }
          }
          const ctype = ctrl.getAttribute('data-type');
          if (type === 'number' || ctype === 'number' || ctype === 'int') {
            const v: any = val.replace(this._nreg, '');
            val = (isNaN(v) ? null : parseFloat(v));
          }
          ReflectionUtil.setValue(obj, name, val); // obj[name] = val;
        }
      }
    }
    return obj;
  }
  public static setReadOnlyForm(form) {
    if (!form) {
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < form.length; i++) {
      const ctrl = form[i];
      const name = ctrl.getAttribute('name');
      if (name != null && name.length > 0 && name !== 'btnBack') {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT'
          && nodeName !== 'SELECT') {
          switch (type) {
            case 'checkbox':
              ctrl.disabled = true;
              break;
            case 'radio':
              ctrl.disabled = true;
              break;
            default:
              ctrl.readOnly = true;
          }
        } else {
          ctrl.disabled = true;
        }
      }
    }
  }
  public static equalsValue(ctrl1, ctrl2) {
    if (ctrl1 === ctrl2) {
      return true;
    } else {
      return false;
    }
  }

  public static isEmpty(ctrl) {
    if (!ctrl) {
      return true;
    }
    const str = this.trimText(ctrl.value);
    return (str === '');
  }

  public static trim(ctrl) {
    if (!ctrl) {
      return;
    }
    const str = ctrl.value;
    const str2 = this.trimText(ctrl.value);
    if (str !== str2) {
      ctrl.value = str2;
    }
  }

  public static focusFirstControl(form) {
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      if (!(ctrl.readOnly || ctrl.disabled)) {
        let nodeName = ctrl.nodeName;
        const type = ctrl.getAttribute('type');
        if (nodeName === 'INPUT' && type !== null) {
          nodeName = type.toUpperCase();
        }
        if (nodeName !== 'BUTTON'
          && nodeName !== 'RESET'
          && nodeName !== 'SUBMIT'
          && nodeName !== 'CHECKBOX'
          && nodeName !== 'RADIO') {
          ctrl.focus();
          ctrl.scrollIntoView();
          try {
            ctrl.setSelectionRange(0, ctrl.value.length);
          } catch (error) {
          }
          return;
        }
      }
    }
  }

  public static focusErrorControl(form) {
    const len = form.length;
    for (let i = 0; i < len; i++) {
      const ctrl = form[i];
      const parent = ctrl.parentElement;
      if (ctrl.classList.contains('invalid')
        || ctrl.classList.contains('.ng-invalid')
        || parent.classList.contains('invalid')) {
        ctrl.focus();
        ctrl.scrollIntoView();
        return;
      }
    }
  }

  public static getControlContainer(control) {
    const p = control.parentElement;
    if (p.nodeName === 'LABEL' || p.classList.contains('form-group')) {
      return p;
    } else {
      const p1 = p.parentElement;
      if (p.nodeName === 'LABEL' || p1.classList.contains('form-group')) {
        return p1;
      } else {
        const p2 = p1.parentElement;
        if (p.nodeName === 'LABEL' || p2.classList.contains('form-group')) {
          return p2;
        } else {
          const p3 = p2.parentElement;
          if (p.nodeName === 'LABEL' || p3.classList.contains('form-group')) {
            return p3;
          } else {
            return null;
          }
        }
      }
    }
  }

  public static getControlFromForm(form, childName) {
    for (const f of form) {
      if (f.name === childName) {
        return f;
      }
    }
    return null;
  }

  public static getControlsFromForm(form, childNames: string[]): any[] {
    const outputs = [];
    for (const f of form) {
      if (!!childNames.find(v => v === f.name)) {
        outputs.push(f);
      }
    }
    return outputs;
  }

  public static getParentByClass(ctrl, className) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.classList.contains(className)) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  public static getParentByNodeNameOrDataField(ctrl, nodeName: string) {
    if (!ctrl) {
      return null;
    }
    let tmp = ctrl;
    while (true) {
      const parent = tmp.parentElement;
      if (!parent) {
        return null;
      }
      if (parent.nodeName === nodeName || parent.getAttribute('data-field') != null) {
        return parent;
      } else {
        tmp = parent;
      }
      if (tmp.nodeName === 'BODY') {
        return null;
      }
    }
  }

  public static getAllDataFields(form): any[] {
    let results = [];
    const attributeValue = form.getAttribute('data-field');
    if (attributeValue && attributeValue.length > 0) {
      results.push(form);
    }
    const childNodes = form.childNodes;
    if (childNodes.length > 0) {
      for (const childNode of childNodes) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          results = results.concat(this.getAllDataFields(childNode));
        }
      }
    }
    return results;
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
