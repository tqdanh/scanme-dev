import {Flow} from './flow/Flow';
import {InitModel} from './InitModel';
import {Module} from './Module';
import {UserAccount} from './UserAccount';

export class storage {
  public static REDIRECT_URL = location.origin + '/index.html?redirect=oAuth2';

  // public static tmpSearchModel = null;
  public static signinMessage = null;
  public static lastSuccessTime = null;

  private static _user = null;
  private static _forms = null;
  public static _sessionStorageAllowed = true;
  private static _flows: any = {};
  private static _webFormLog: any;
  private static _initData: InitModel;

  public static getRedirectUrl() {
    return encodeURIComponent(storage.REDIRECT_URL);
  }

  private static sortByOrder(a, b) {
    if (a.order == null) {
      a.order = 99;
    }
    if (b.order == null) {
      b.order = 99;
    }

    if (a.order > b.order) {
      return 1;
    } else if (a.order < b.order) {
      return -1;
    } else {
      return 0;
    }
  }

  private static sortForms(forms: Module[]) {
    for (const form of forms) {
      if (form.modules && Array.isArray(form.modules)) {
        this.sortForms(form.modules);
      }
    }
    return forms.sort(this.sortByOrder);
  }
/*
  private static standardize(forms: Module[]) {
    for (const form of forms) {
      if (form.modules) {
        for (const sub of form.modules) {
          sub.parent = form;
          storage.standardize((form.modules));
        }
      }
    }
  }
*/
  public static setForms(forms: Module[]) {
    if (forms) {
      this.sortForms(forms);
      // this.standardize(forms);
    }
    storage._forms = forms;
    if (storage._sessionStorageAllowed === true) {
      try {
        if (forms != null) {
          sessionStorage.setItem('forms', JSON.stringify(forms));
        } else {
          sessionStorage.removeItem('forms');
        }
      } catch (err) {
        storage._sessionStorageAllowed = false;
      }
    }
  }

  public static getForms(): Module[] {
    /*
    const url = this.serviceUrl;
    console.log('menu', url);
    return of(mockForms).pipe(map(forms => {
      this.sortForms(forms);
      return forms;
    }));
    */
    let forms = storage._forms;
    if (!forms) {
      if (storage._sessionStorageAllowed === true) {
        try {
          const rawForms = sessionStorage.getItem('forms');
          if (!!rawForms) {
            storage._forms = JSON.parse(rawForms);
            forms = storage._forms;
          }
        } catch (err) {
          storage._sessionStorageAllowed = false;
        }
      }
    }
    if (forms) {
      return forms;
    } else {
      return [];
    }
  }

  public static setUser(user: UserAccount) {
    storage._user = user;
    if (storage._sessionStorageAllowed === true) {
      try {
        if (user != null) {
          sessionStorage.setItem('authService', JSON.stringify(user));
        } else {
          sessionStorage.removeItem('authService');
        }
      } catch (err) {
        storage._sessionStorageAllowed = false;
      }
    }
  }
  public static getUser(): UserAccount {
    let user = storage._user;
    if (!user) {
      if (storage._sessionStorageAllowed === true) {
        try {
          const authService = sessionStorage.getItem('authService');
          if (!!authService) {
            storage._user = JSON.parse(authService);
            user = storage._user;
          }
        } catch (err) {
          storage._sessionStorageAllowed = false;
        }
      }
    }
    return user;
  }
  public static getUserId(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.userId;
    }
  }
  public static getUserName(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.userName;
    }
  }
  public static getDisplayUserName(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.displayName;
    }
  }
  public static getProviderIdOfUser(): any {
    const user = storage.getUser();
    if (!user) {
      return '';
    } else {
      return user.providerId;
    }
  }
  public static getToken(): string {
    const user = storage.getUser();
    if (!user) {
      return null;
    } else {
      return user.token;
    }
  }

  public static getUserType(): string {
    const user = storage.getUser();
    if (!user) {
      return null;
    } else {
      return user.userType;
    }
  }
  public static getFlow(flowId: string): Flow {
    return this._flows[flowId];
  }
  public static setFlow(flowId: string, flow: Flow) {
    this._flows[flowId] = flow;
  }
  public static setInitModel(initData: InitModel) {
    this._initData = initData;
  }
  public static getInitModel() {
    return this._initData;
  }

  public static getWebFormLog() {
    return this._webFormLog;
  }

  public static addWebFormLogDetail(data: any) {
    if (!this._webFormLog) {
      this._webFormLog = {
        action: null,
        remarks: null,
        reason: null,
        responseCode: null,
        status: '',
        details: [],
        dateTime: new Date(),
        webFormId: this.getInitModel() && this.getInitModel().formId,
        mobileNo: this.getInitModel() && this.getInitModel().mobileNo
      };
    }
    data.detailLog.forEach(item => {
      this._webFormLog.details.push(item);
    });
    this._webFormLog.responseCode = data.responseCode;
    this._webFormLog.dateTime = new Date();
    this._webFormLog.status = data.status;
    this._webFormLog.remarks = data.remark;
    this._webFormLog.reason = data.reason;
  }
}
