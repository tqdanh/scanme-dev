import * as React from 'react';
import {Locale} from '../locale/model/Locale';
import {localeService} from '../locale/service/LocaleService';
import {ResourceManager} from '../ResourceManager';
import {storage} from '../storage';
import {DateUtil} from '../util/DateUtil';
import {DeviceUtil} from '../util/DeviceUtil';
import {FormatUtil} from '../util/FormatUtil';
import {LoadingUtil} from '../util/LoadingUtil';
import {UIUtil} from '../util/UIUtil';
import {BaseInternalState} from './BaseInternalState';
import {HistoryProps} from './HistoryProps';

export class BaseViewComponent<W extends HistoryProps, I extends BaseInternalState> extends React.Component<W, I & any> {
  constructor(props) {
    super(props);
    this.initDateFormat = this.initDateFormat.bind(this);
    this.getDateFormat = this.getDateFormat.bind(this);
    this.initDateFormat();
    this.init = this.init.bind(this);
    this.initForm = this.initForm.bind(this);
    this.initPermission = this.initPermission.bind(this);
    this.initData = this.initData.bind(this);
    this.loadData = this.loadData.bind(this);

    this.getLanguage = this.getLanguage.bind(this);
    this.getLocale = this.getLocale.bind(this);
    this.formatCurrency = this.formatCurrency.bind(this);
    this.formatDate = this.formatDate.bind(this);

    this.formatPhone = this.formatPhone.bind(this);
    this.formatFax = this.formatFax.bind(this);

    this.back = this.back.bind(this);
    this.navigate = this.navigate.bind(this);

    this.navigateToHome = this.navigateToHome.bind(this);
    this.requireAuthentication = this.requireAuthentication.bind(this);

    this.handleError = this.handleError.bind(this);

    this.alertWarning = this.alertWarning.bind(this);
    this.alertError = this.alertError.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  protected resource: any = ResourceManager.getResource();
  protected dateFormat: string = null;
  protected dateTimeFormat: string = null;
  protected running: boolean;

  public componentDidMount() {
    this.init();
  }

  protected initDateFormat() {
    if (this.dateFormat == null) {
      const df = this.getDateFormat();
      this.dateFormat = df;
      this.dateTimeFormat = df.toUpperCase() + ' hh:mm:ss';
    }
  }
  protected getDateFormat(): string {
    const user = storage.getUser();
    if (user) {
      if (user.dateFormat) {
        const x = user.dateFormat;
        return x.toUpperCase();
      } else if (user.language) {
        const locale = localeService.getLocaleOrDefault(user.language);
        const x = locale.dateFormat;
        return x.toUpperCase();
      } else {
        const language = DeviceUtil.getLanguage();
        const locale = localeService.getLocaleOrDefault(language);
        const x = locale.dateFormat;
        return x.toUpperCase();
      }
    } else {
      const language = DeviceUtil.getLanguage();
      const locale = localeService.getLocaleOrDefault(language);
      const x = locale.dateFormat;
      return x.toUpperCase();
    }
  }
  init() {
    this.initPermission();
    this.initForm();
    this.initData();
  }

  initForm() {
  }

  initPermission() {
  }

  initData() {
    this.loadData();
  }

  loadData() {
  }

  protected getLanguage(): string {
    const user = storage.getUser();
    if (user && user.language) {
      return user.language;
    } else {
      return DeviceUtil.getLanguage();
    }
  }

  protected getLocale(): Locale {
    return localeService.getLocaleOrDefault(this.getLanguage());
  }

  protected formatFax = (value) => {
    return FormatUtil.formatFax(value);
  }

  protected formatPhone = (value) => {
    return FormatUtil.formatPhone(value);
  }

  protected formatCurrency(currency: number) {
    return localeService.formatCurrency(currency, this.getLocale());
  }

  protected formatDate(date: Date, format?: string, locale?: string): string {
    if (format) {
      return DateUtil.formatDate(date, format);
    } else {
      return localeService.formatDate(date, this.getLocale());
    }
  }

  protected parseDate(date: string, format?: string, locale?: string): Date {
    return new Date(date);
  }

  protected dateToDefaultString(date: Date): string {
    return DateUtil.formatDate(date, 'YYYY-MM-DD');
  }

  protected back(event) {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  }

  protected navigate(stateTo: string) {
    this.props.history.push(stateTo);
  }

  public requireAuthentication() {
    sessionStorage.clear();
    const redirect = window.location.search.includes('?redirect=');
    if (redirect) {
      this.props.history.push('/auth?redirect=' + window.location.search.slice(10));
    } else {
      this.props.history.push('/auth');
    }
  }

  protected navigateToHome() {
    const redirect = window.location.search;
    if (redirect) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      this.props.history.push(searchParams.get('redirect'));
    } else {
      this.props.history.push('/bigchain');
    }
  }

  handleError(response = null, flowId: string = null) {
    LoadingUtil.resetLoading();
    this.running = false;
    // const data = response && response.response && response.response.data ? response.response.data : response;
    let data = response.response ? response.response : response;
    const descriptions = [];
    const errCodeList = [];
    let callBack = null;
    const title = ResourceManager.getString('error');
    if ( data.status === 404 ) {
      const msg = ResourceManager.getString('error_not_found');
      errCodeList.push(data.statusText);
      descriptions.push(msg);
      const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
      callBack = this.makeCallBackHandleError(errCode);

      UIUtil.alertError(descriptions.join('<br>'), title, null, callBack);
    } else if ( data.status === 401 ) {
      const msg = ResourceManager.getString('error_unauthorized');
      errCodeList.push('InvalidAuthorizationToken');
      descriptions.push(msg);
      const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
      callBack = this.makeCallBackHandleError(errCode);

      UIUtil.alertError(descriptions.join('<br>'), title, null, callBack);
    } else if ( data.status === 403 ) {
      const msg = ResourceManager.getString('error_forbidden');
      errCodeList.push('Forbidden');
      descriptions.push(msg);
      const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
      callBack = this.makeCallBackHandleError(errCode);

      UIUtil.alertError(descriptions.join('<br>'), title, null, callBack);
    } else {
      data = response && response.response && response.response.data ? response.response.data : response;
      if (data && data.status === 'F' && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        const errors = data.errors;

        for (const error of errors) {
          errCodeList.push(error.code);
          descriptions.push(error.description);
        }

        const errCode = this.returnErrCodeIfExist(errCodeList, 'InvalidAuthorizationToken');
        callBack = this.makeCallBackHandleError(errCode);

        UIUtil.alertError(descriptions.join('<br>'), title, null, callBack);
      } else {
        UIUtil.alertError(response, title);
      }
    }
  }
  public makeCallBackHandleError(errCode: string): any {
    switch (errCode) {
      case 'InvalidAuthorizationToken': {
        return  this.requireAuthentication();
      }
    }
  }
  public returnErrCodeIfExist(arrayErrCode: string[], expected: string): string {
    return arrayErrCode.find(errCode => errCode === expected);
  }


  protected alertError(msg) {
    // @ts-ignore
    try {
      if ((window as any).sysAlert !== undefined) {
        (window as any).sysAlert.style.display = 'block';
      }
    } catch (er) {
    }
    const resource = this.resource;
    UIUtil.alertError(msg, resource.error, null, null, null, resource.modal_confirm_btnAccept);
  }

  protected alertWarning(msg, iconType) {
    // @ts-ignore
    try {
      if ((window as any).sysAlert !== undefined) {
        (window as any).sysAlert.style.display = 'block';
      }
    } catch (er) {
    }
    const resource = this.resource;
    UIUtil.alertWarning(msg, null, null, iconType, resource.modal_confirm_btnAccept);
  }

  protected confirm(msg, yescallback, iconType = null) {
    const resource = this.resource;
    const title = ResourceManager.getString('confirm');
    UIUtil.confirm(msg, title, yescallback, resource.button_no, resource.button_yes, iconType);
  }

  protected showToast(msg) {
    try {
      if ((window as any).sysToast !== undefined) {
        (window as any).sysToast.style.display = 'block';
      }
    } catch (er) {
      console.log(er);
    }
    UIUtil.showToast(msg);
  }
}
