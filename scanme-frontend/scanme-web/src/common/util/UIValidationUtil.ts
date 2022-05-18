import {ResourceManager} from '../ResourceManager';
import {DateUtil} from './DateUtil';
import {StringUtil} from './StringUtil';
import {UIUtil} from './UIUtil';
import { ValidationUtil } from './ValidationUtil';

export class UIValidationUtil {
  private static _nreg = / |,|\$|\€|\£|\£|¥/g;
  private static _preg = / |,|%|\$|\€|\£|\£|¥/g;

  public static isValidForm(form, focusFirst = null, scroll = null, scope = null) {
    const valid = true;
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      const parent = ctrl.parentElement;
      if (ctrl.classList.contains('invalid')
        || ctrl.classList.contains('ng-invalid')
        || parent.classList.contains('invalid')) {
        if (!focusFirst) {
          focusFirst = true;
        }
        if (!!ctrl && focusFirst === true) {
          ctrl.focus();
          if (scroll === true) {
            ctrl.scrollIntoView();
          }
        }
        return false;
      }
    }
    return valid;
  }

  public static validateForm(form, focusFirst = null, scroll = null, scope = null): boolean {
    let valid = true;
    let errorCtrl = null;
    let i = 0;
    const len = form.length;
    for (i = 0; i < len; i++) {
      const ctrl = form[i];
      let type = ctrl.getAttribute('type');
      if (type != null) {
        type = type.toLowerCase();
      }
      if (type === 'checkbox'
        || type === 'radio'
        || type === 'submit'
        || type === 'button'
        || type === 'reset') {
        continue;
      } else {
        if (!this.validateControl(ctrl, scope)) {
          valid = false;
          if (!errorCtrl) {
            errorCtrl = ctrl;
          }
        } else {
          UIValidationUtil.removeErrorMessage(ctrl); // ValidationUtil.setValidControl(ctrl);
        }
      }
    }
    if (!focusFirst) {
      focusFirst = true;
    }
    if (errorCtrl !== null && focusFirst === true) {
      errorCtrl.focus();
      if (scroll === true) {
        errorCtrl.scrollIntoView();
      }
    }
    return valid;
  }

  public static showFormError(form, errors, focusFirst = null): any[] {
    if (!errors || errors.length === 0) {
      return [];
    }
    let errorCtrl = null;
    const errs = [];
    const length = errors.length;
    const len = form.length;

    for (let i = 0; i < length; i++) {
      let hasControl = false;
      for (let j = 0; j < len; j++) {
        const ctrl = form[j];
        if (ctrl.name === errors[i].attribute) {
          this.addErrorMessage(ctrl, errors[i].message);
          hasControl = true;
          if (!errorCtrl) {
            errorCtrl = ctrl;
          }
        }
      }
      if (hasControl === false) {
        errs.push(errors[i]);
      }
    }
    if (!focusFirst) {
      focusFirst = true;
    }
    if (errorCtrl !== null && focusFirst === true) {
      errorCtrl.focus();
      errorCtrl.scrollIntoView();
    }
    return errs;
  }

  public static checkRequired(ctrl) {
    const value = ctrl.value;
    const label = UIUtil.getLabel(ctrl);
    if (!value || value.length === 0 || value.trim().length === 0) {
      const msg = StringUtil.format(ResourceManager.getString('error_required'), label);
      this.addErrorMessage(ctrl, msg);
      return false;
    } else {
      return true;
    }
  }

  public static validateControls(controls): boolean {
    let valid = true;
    let errorCtrl = null;
    for (const c of controls) {
      if (!this.validateControl(c)) {
        valid = false;
        if (!errorCtrl) {
          errorCtrl = c;
        }
      } else {
        UIValidationUtil.removeErrorMessage(c);
      }
    }
    if (errorCtrl !== null) {
      errorCtrl.focus();
      errorCtrl.scrollIntoView();
    }
    return valid;
  }

  public static validateControl(ctrl, isDivide = null) {
    if (!ctrl) {
      return true;
    }

    if (!ctrl || ctrl.readOnly || ctrl.disabled || ctrl.hidden || ctrl.style.display === 'none') {
      return true;
    }
    let nodeName = ctrl.nodeName;
    if (nodeName === 'INPUT') {
      const type = ctrl.getAttribute('type');
      if (type !== null) {
        nodeName = type.toUpperCase();
      }
    }
    if (nodeName === 'BUTTON'
      || nodeName === 'RESET'
      || nodeName === 'SUBMIT') {
      return true;
    }

    const parent: any = UIUtil.getControlContainer(ctrl);
    if (parent) {
      if (parent.hidden || parent.style.display === 'none') {
        return true;
      } else {
        const p = UIUtil.getParentByNodeNameOrDataField(parent, 'SECTION');
        if (p && (p.hidden || p.style.display === 'none')) {
          return true;
        }
      }
    }

    let value = ctrl.value;

    const label = UIUtil.getLabel(ctrl);
    let required = ctrl.getAttribute('config-required');
    if (required == null || required === undefined) {
      required = ctrl.getAttribute('required');
    }
    if (required == null || required === undefined) {
      required = ctrl.getAttribute('ng-required');
    }
    if (required !== null && required !== 'false') {
      if (!value || value.length === 0 || value.trim().length === 0) {
        // const errorKey = (ctrl.nodeName === 'SELECT' ? 'error_select_required' : 'error_required');
        const errorKey = 'error_required';
        const msg = StringUtil.format(ResourceManager.getString(errorKey), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    }

    const datatype1 = ctrl.getAttribute('data-type');
    if (datatype1 === 'number' || datatype1 === 'int') {
      value = value.replace(this._nreg, '');
    } else if (datatype1 === 'currency' || datatype1 === 'string-currency') {
      value = value.replace(this._nreg, '');
      const symbol = ctrl.form.currencySymbol;
      if (symbol !== null) {
        value = value.replace(symbol, '');
      }
    } else if (datatype1 === 'percentage') {
      value = value.replace(this._preg, '');
    }

    if (!value || value === '') {
      return true;
    }
    const maxlength = ctrl.getAttribute('maxlength');
    if (!!maxlength && !isNaN(maxlength)) {
      const imaxlength = parseInt(maxlength, null);
      if (value.length > imaxlength) {
        const msg = StringUtil.format(ResourceManager.getString('error_maxlength'), label, maxlength);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    }
    const minlength = ctrl.getAttribute('minlength');
    if (minlength !== null && !isNaN(minlength)) {
      const iminlength = parseInt(minlength, null);
      if (value.length < iminlength) {
        const msg = StringUtil.format(ResourceManager.getString('error_minlength'), label, minlength);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    }
    const ctype = ctrl.getAttribute('type');
    let datatype2 = ctrl.getAttribute('data-type');
    let pattern = ctrl.getAttribute('config-pattern');
    const patternModifier = ctrl.getAttribute('config-pattern-modifier');
    if (pattern == null || pattern === undefined) {
      pattern = ctrl.getAttribute('pattern');
    }
    if (ctype === 'email') {
      datatype2 = 'email';
    } else if (ctype === 'url') {
      datatype2 = 'url';
    }
    if (pattern) {
      const resource_key = ctrl.getAttribute('resource-key') || ctrl.getAttribute('config-pattern-error-key');
      if (!ValidationUtil.isValidPattern(pattern, patternModifier, value)) {
        const msg = StringUtil.format(ResourceManager.getString(resource_key), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    }
    if (datatype2 === 'email') {
      if (value.length > 0 && !ValidationUtil.isEmail(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_email'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'number' || datatype2 === 'int' || datatype2 === 'currency' || datatype2 === 'string-currency' || datatype2 === 'percentage') {
      if (datatype2 === 'number' || datatype2 === 'int') {
        if (isNaN(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_number'), label);
          this.addErrorMessage(ctrl, msg, isDivide);
          return false;
        } else if (datatype2 === 'int' && !ValidationUtil.isInteger(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_number'), label);
          this.addErrorMessage(ctrl, msg, isDivide);
          return false;
        } else if (datatype2 === 'int' && value.indexOf('.') >= 0) {
          const msg = StringUtil.format(ResourceManager.getString('error_integer'), label);
          this.addErrorMessage(ctrl, msg, isDivide);
          return false;
        }
      } else if (datatype2 === 'currency' || datatype2 === 'string-currency' || datatype2 === 'percentage') {
        if (isNaN(value)) {
          const msg = StringUtil.format(ResourceManager.getString('error_number'), label);
          this.addErrorMessage(ctrl, msg, isDivide);
          return false;
        }
      }
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
          this.addErrorMessage(ctrl, msg, isDivide);
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
          this.addErrorMessage(ctrl, msg, isDivide);
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
                this.addErrorMessage(ctrl, msg);
                return false;
              }
            }
          }
        }
      }
    } else if (datatype2 === 'date') {
      let dateFormat: string = ctrl.getAttribute('uib-datepicker-popup');
      if (!dateFormat || dateFormat.length === 0) {
        dateFormat = ctrl.getAttribute('datepicker-popup');
      }
      const isDate = DateUtil.isDate(value, dateFormat);
      if (isDate === false) {
        const msg = StringUtil.format(ResourceManager.getString('error_date'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      } else {
        const maxdate = ctrl.getAttribute('max-date');
        const mindate = ctrl.getAttribute('min-date');
        if (maxdate !== null || mindate !== null) {
          const date = DateUtil.parse(value, dateFormat);
          if (maxdate !== null) {
            let strDate = null;
            let dmaxdate: Date = null;
            if (maxdate.startsWith('\'') || maxdate.startsWith('"')) {
              strDate = maxdate.substring(1, maxdate.length - 1);
              dmaxdate = DateUtil.parse(strDate, 'yyyy-MM-dd');
            }
            if (dmaxdate !== null && date > dmaxdate) {
              const pmaxdate = DateUtil.formatDate(dmaxdate, dateFormat);
              const msg = StringUtil.format(ResourceManager.getString('error_max_date'), label);
              this.addErrorMessage(ctrl, msg, isDivide);
              return false;
            }
          }
          if (mindate !== null) {
            let strDate = null;
            let dmindate = null;
            if (mindate.startsWith('\'') || mindate.startsWith('"')) {
              strDate = mindate.substring(1, mindate.length - 1);
              dmindate = DateUtil.parse(strDate, 'yyyy-MM-dd');
            }
            if (dmindate !== null && date < dmindate) {
              const pmindate = DateUtil.formatDate(dmindate, dateFormat);
              const msg = StringUtil.format(ResourceManager.getString('error_min_date'), label);
              this.addErrorMessage(ctrl, msg, isDivide);
              return false;
            }
          }
        }
      }
    } else if (datatype2 === 'url') {
      if (!ValidationUtil.isValidURL(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_url'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'phone') {
      if (!ValidationUtil.isPhone(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_phone'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
      /* else {
               // reformat phone number
               // (555) 123-4567 or +1 (555) 123-4567
               ctrl = FormatUtil.formatPhone(value);

               // // wiill move this part to string util later
               // var phone =  value.replace(/\+|\-|\.|\(|\)/g, "").replaceAll(" ", "");
               //
               // if(phone.length === 10){
               //   var USNumber = phone.match(/(\d{3})(\d{3})(\d{4})/);
               //   ctrl = "(" + USNumber[1] + ") " + USNumber[2] + "-" + USNumber[3];
               // } else if(phone.length === 11){
               //   var USNumber = phone.match(/(\d{1})(\d{3})(\d{3})(\d{4})/);
               //   ctrl = "+" + USNumber[1]  + " (" + USNumber[2] + ") " + USNumber[3] + "-" + USNumber[4];
               // }

               //update new format for ng model
               var $e = DOM.query(ctrl);
               $e.triggerHandler('input');
             } */
    } else if (datatype2 === 'password') {
      if (!ValidationUtil.isValidPassword(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_password'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'digitalcode') {
      if (!ValidationUtil.isDigitalCode(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_digitalCode'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringaccountnumber') {
      if (!ValidationUtil.isStringAccountNumber(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_account_number'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringroutingnumber') {
      if (!ValidationUtil.isStringNumberAndDash(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_routing_number'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringchecknumber') {
      if (!ValidationUtil.isStringCheckNumber(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_stringchecknumber'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringdatetime') {
      if (!DateUtil.isDate(value, DateUtil.getFormatDate())) {
        const msg = StringUtil.format(ResourceManager.getString('error_stringdatetime'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringssnnumber') {
      if (!ValidationUtil.isStringSSNNumber(value)) {
        let msg = null;
        if (label.toLowerCase() === ResourceManager.getString('payout_ssn_representative').toLowerCase()) {
          msg = StringUtil.format(ResourceManager.getString('error_stringssnrepresentativenumber'), label);
        } else if (label.toLowerCase() === ResourceManager.getString('payout_sin_representative').toLowerCase()) {
          msg = StringUtil.format(ResourceManager.getString('error_stringsinrepresentativenumber'), label);
        } else if (label.toLowerCase() === ResourceManager.getString('payout_ssn').toLowerCase()) {
          msg = StringUtil.format(ResourceManager.getString('error_stringssnnumber'), label);
        } else if (label.toLowerCase() === ResourceManager.getString('payout_sin').toLowerCase()) {
          msg = StringUtil.format(ResourceManager.getString('error_stringsinnumber'), label);
        } else {
          msg = '';
        }
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'stringbusinesstaxidnumber') {
      if (!ValidationUtil.isStringNumberAndDash(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_stringBusinessTaxId'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'amountnumber') {
      if (!ValidationUtil.isAmountNumber(value.match(/\d+\.\d+/))) {
        const msg = StringUtil.format(ResourceManager.getString('error_amount_number'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'uspostalcode') {
      if (!ValidationUtil.isUSPostalCode(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_postal_code'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    } else if (datatype2 === 'capostalcode') {
      if (!ValidationUtil.isCAPostalCode(value)) {
        const msg = StringUtil.format(ResourceManager.getString('error_postal_code'), label);
        this.addErrorMessage(ctrl, msg, isDivide);
        return false;
      }
    }
    this.removeErrorMessage(ctrl);
    return true;
  }

  public static setValidControl(ctrl) {
    if (!ctrl.classList.contains('valid')) {
      ctrl.classList.add('valid');
    }
    ctrl.classList.remove('md-input-invalid');
    ctrl.classList.remove('ng-invalid');
    ctrl.classList.remove('invalid');
    ctrl.classList.remove('ng-touched');

    const parent = UIUtil.getControlContainer(ctrl);
    if (parent != null) {
      if (!parent.classList.contains('valid')) {
        parent.classList.add('valid');
      }
      parent.classList.remove('valid');
      parent.classList.remove('invalid');
      parent.classList.remove('md-input-invalid');
      const span = parent.querySelector('.span-error');
      if (span !== null && span !== undefined) {
        parent.removeChild(span);
      }
    }
  }

  public static addErrorMessage(ctrl, msg, isDivide: boolean = null) {
    if (!ctrl) {
      return;
    }

    if (!ctrl.classList.contains('invalid')) {
      ctrl.classList.add('invalid');
    }
    if (!ctrl.classList.contains('ng-touched')) {
      ctrl.classList.add('ng-touched');
    }
    const parrent: any = UIUtil.getControlContainer(ctrl);
    if (parrent === null) {
      return;
    }
    if (parrent.nodeName && parrent.nodeName === 'LABEL' && !parrent.classList.contains('invalid')) {
      parrent.classList.add('invalid');
    } else if (parrent.classList.contains('form-group') && !parrent.classList.contains('invalid')) {
      parrent.classList.add('invalid');
    } else if (parrent.nodeName === 'MD-INPUT-CONTAINER' && !parrent.classList.contains('md-input-invalid')) {
      parrent.classList.add('md-input-invalid');
    }

    const span = parrent.querySelector('.span-error');

    if (span) {
      if (span.innerHTML !== msg) {
        span.innerHTML = msg;
      }
    } else {
      const spanError = document.createElement('span');
      spanError.classList.add('span-error');
      spanError.innerHTML = msg;
      parrent.appendChild(spanError);
    }
  }

  public static removeFormError(form) {
    if (form) {
      const len = form.length;
      for (let i = 0; i < len; i++) {
        const ctrl = form[i];
        this.removeErrorMessage(ctrl);
      }
    }
  }

  public static removeErrorMessage(ctrl) {
    if (!ctrl) {
      return;
    }
    ctrl.classList.remove('valid');
    ctrl.classList.remove('md-input-invalid');
    ctrl.classList.remove('ng-invalid');
    ctrl.classList.remove('invalid');
    ctrl.classList.remove('ng-touched');

    const parent = UIUtil.getControlContainer(ctrl);
    if (parent != null) {
      parent.classList.remove('valid');
      parent.classList.remove('invalid');
      parent.classList.remove('md-input-invalid');
      const span = parent.querySelector('.span-error');
      if (span !== null && span !== undefined) {
        parent.removeChild(span);
      }
    }
  }

  public static buildErrorMessage(errors) {
    if (!errors || errors.length === 0) {
      return '';
    }
    const sb = new Array();
    for (let i = 0; i < errors.length; i++) {
      sb.push(errors[i].message);
      if (i < errors.length - 1) {
        sb.push('<br />');
      }
    }
    return sb.join('');
  }

  public static checkExistInList(value: string, list: any[]): boolean {
    const filter = list.filter(item => item === value);
    return filter.length > 0;
  }

  public static uniqueArray = (array: string[]) => {
    const arrTemp = array.concat();
    for (let i = 0; i < arrTemp.length; ++i) {
      for (let j = i + 1; j < arrTemp.length; ++j) {
        if (arrTemp[i] === arrTemp[j]) {
          arrTemp.splice(j--, 1);
        }
      }
    }
    return arrTemp;
  }
}
