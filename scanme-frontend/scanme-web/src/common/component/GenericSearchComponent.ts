import {Model} from '../metadata/Model';
import {MetadataUtil} from '../metadata/util/MetadataUtil';
import {ResultInfo} from '../model/ResultInfo';
import {SearchModel} from '../model/SearchModel';
import {StatusCode} from '../model/StatusCode';
import {ResourceManager} from '../ResourceManager';
import {GenericSearchService} from '../service/GenericSearchService';
import {storage} from '../storage';
import {MessageUtil} from '../util/MessageUtil';
import {ReflectionUtil} from '../util/ReflectionUtil';
import {UIUtil} from '../util/UIUtil';
import {UIValidationUtil} from '../util/UIValidationUtil';
import {BaseGenericSearchComponent} from './BaseGenericSearchComponent';
import {HistoryProps} from './HistoryProps';
import {IdBuilder} from './IdBuilder';
import {SearchPermissionBuilder} from './SearchPermissionBuilder';
import {SearchState} from './SearchState';

export class GenericSearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T> & any> extends BaseGenericSearchComponent<T, S, W, I & any> {
  constructor(props, metadata: Model, service: GenericSearchService<T, S>, searchPermissionBuilder: SearchPermissionBuilder, autoSearch: boolean = true, listFormId: string = null) {
    super(props, metadata, service, searchPermissionBuilder, autoSearch, listFormId);
    this.getForm = this.getForm.bind(this);
    this.setForm = this.setForm.bind(this);
    this.getId = this.getId.bind(this);
    this.loadModel = this.loadModel.bind(this);
  }
  private newMode = true;
  protected setBack = false;
  protected updateChangedOnly = false;
  protected orginalModel: T;

  protected orginalModelRedux = null;

  insertSuccessMsg: string = ResourceManager.getString('msg_save_success');
  updateSuccessMsg: string = ResourceManager.getString('msg_save_success');

  protected setForm(form) {
    this.form = form;
  }

  protected getForm(): any {
    return this.form;
  }

  loadData() {
    const com = this;
    if (com.autoSearch) {
      // tslint:disable-next-line:only-arrow-functions
      this.currentPage = this.pageIndex;
      if (!this._ignoreUrlParam) {
        this.mergeUrlSearchModelToState();
      }
      setTimeout(function () {
        com._lastSearchedTime = new Date();
        com._bkpageIndex = com.pageIndex;
        this._loaded = true;
        com.doSearch(true);
      }, 100);
    }
    const id = this.getId();
    if (id != null && id !== '') {
      // tslint:disable-next-line:only-arrow-functions
      setTimeout(function () {
        com.loadModel(id);
      }, 0);
    } else {
      // Call service state
      const obj = this.createModel();
      this.setNewMode(true);
      this.formatModel(obj);
      this.orginalModel = null;
      this.showModel(obj);
    }
  }

  protected loadModel(id) {
    if (id != null && id !== '') {
      if (this.viewable !== true) {
        const title = ResourceManager.getString('error_permission');
        const msg = ResourceManager.getString('error_permission_view');
        UIUtil.alertError(msg, title);
        const user = storage.getUser();
        if (!!user) {
          this.navigateToHome();
        } else {
          this.requireAuthentication();
        }
      } else {
        if  (this.props[this.getModelName()]) {
          // Call service redux
          this.setNewMode(false);
          this.service.getById({id, callback: { execute: this.saveModelToState, handleError: this.handleError }});
        } else {
          // Call service state
          this.service.getById(id).subscribe(obj => {
            this.setNewMode(false);
            this.formatModel(obj);
            this.orginalModel = ReflectionUtil.cloneObject(obj);
            this.showModel(obj);
          }, err => this.handleError(err));
        }
      }
    }
  }

  // can be in ViewComponent
  protected getId(): any {
    if (this._id) {
      return this._id;
    } else {
      if (!this.metadata) {
        return null;
      } else {
        return IdBuilder.buildId(this.metadata, this.props);
      }
    }
  }

  protected getModelName() {
    return this.metadata.name;
  }

  getModel(): T {
    return this.getModelFromState();
  }

  protected formatModel(obj): any {
    return obj;
  }

  showModel(model: T) {
    this.saveModelToState(model);
  }

  protected saveModelToState(model: T) {
    const props: any = this.props;
    if (props.props.setGlobalState) {
      this.orginalModelRedux = model;
      const form = this.getForm();
      props.props.setGlobalState({[form.name]: model});
      setTimeout(() => {
        if (this.editable === false) {
          UIUtil.setReadOnlyForm(form);
        }
      }, 100);
    } else {
      const modelName = this.getModelName();
      const objSet: any = {};
      objSet[modelName] = model;
      this.setState(objSet, () => {
        if (this.editable === false) {
          const form = this.getForm();
          UIUtil.setReadOnlyForm(form);
        }
      });
      // throw new Error('Component must add setGlobalState: (data) => dispatch(updateGlobalState(data)) into props');
    }
  }

  protected getModelFromState(): any {
    return this.props[this.getModelName()] || this.state[this.getModelName()];
  }
  // end of: can be in ViewComponent

  protected setNewMode(_newMode: boolean) {
    this.newMode = _newMode;
  }
  isNewMode(): boolean {
    return this.newMode;
  }

  protected createModel(): T {
    const obj = MetadataUtil.createModel(this.metadata);
    return obj;
  }

  newOnClick = (event) => {
    event.preventDefault();
    const form = event.target.form;
    UIValidationUtil.removeFormError(form);
    const obj = this.createModel();
    this.setNewMode(true);
    this.orginalModel = null;
    this.showModel(obj);
    // tslint:disable-next-line:only-arrow-functions
    setTimeout(function () {
      UIValidationUtil.removeFormError(form);
    }, 300);
  }

  protected saveOnClick = (event) => {
    event.preventDefault();
    event.persist();
    this.setForm(event.target.form);
    if (this.isNewMode() === true && this.addable === false) {
      const title = ResourceManager.getString('error_permission');
      const msg = ResourceManager.getString('error_permission_add');
      UIUtil.alertError(msg, title);
      const user = storage.getUser();
      if (!!user) {
        this.navigateToHome();
      } else {
        this.requireAuthentication();
      }
      return;
    } else if (this.isNewMode() === false && this.editable === false) {
      const title = ResourceManager.getString('error_permission');
      const msg = ResourceManager.getString('error_permission_edit');
      UIUtil.alertError(msg, title);
      const user = storage.getUser();
      if (!!user) {
        this.navigateToHome();
      } else {
        this.requireAuthentication();
      }
      return;
    } else {
      if (this.running === true) {
        return;
      }
      const com = this;
      const obj = com.getModel();
      const diff = ReflectionUtil.diff(this.orginalModelRedux || this.orginalModel, obj);
      const keys = Object.keys(diff);
      if (this.isNewMode() === false && keys.length === 0) {
        UIUtil.showToast(ResourceManager.getString('msg_no_change'));
      } else {
        com.validate(obj, obj2 => {
          const title = ResourceManager.getString('confirm');
          const confirmMsg = ResourceManager.getString('msg_confirm_save');
          const strYes = ResourceManager.getString('button_yes');
          const strNo = ResourceManager.getString('button_no');
          UIUtil.confirm(confirmMsg, title, () => {
            com.save(obj2, diff);
          }, strNo, strYes);
        });
      }
    }
  }

  // tslint:disable-next-line:ban-types
  protected validate(obj, callback: Function) {
    const form = this.getForm();
    const valid = UIValidationUtil.validateForm(form);
    if (valid) {
      callback(obj);
    }
  }
  protected save(obj, diff?: any) {
  }

  protected makePatchBodyFromDiff(diff: object): object {
    const body = {};
    // tslint:disable-next-line:forin
    for (const item in diff) {
      Object.assign(body, { [item]: diff[item][0] });
    }
    return body;
  }

  protected succeed(result: ResultInfo<T>) {
    const model = result.value;
    this.setNewMode(false);
    if (this.setBack === true) {
      this.formatModel(model);
      this.showModel(model);
    } else {
      const obj = this.getModel();
      const obj3: any = obj;
      if (obj3.rowVersion != null) {
        obj3.rowVersion = obj3.rowVersion + 1;
      } else {
        obj3.rowVersion = 1;
      }
    }
  }
  protected fail(result: ResultInfo<T>) {
    const errors = result.errors;
    const form = this.getForm();
    const unmappedErrors = UIValidationUtil.showFormError(form, errors);
    UIUtil.focusErrorControl(form);
    if (!result.message) {
      if (!!errors && errors.length === 1) {
        result.message = errors[0].message;
      } else {
        result.message = UIValidationUtil.buildErrorMessage(unmappedErrors);
      }
    }
    this.showDanger(result.message);
  }
  protected afterInsert(result: ResultInfo<T>) {
    this.running = false;
    if (result.status === StatusCode.Success) {
      this.succeed(result);
      UIUtil.showToast(this.insertSuccessMsg);
    } else if (result.status === StatusCode.Error) {
      this.fail(result);
    } else if (result.status === StatusCode.RequiredIdError) {
      this.handleRequiredIdError(result);
    } else if (result.status === StatusCode.DuplicatedIdError) {
      this.handleDuplicatedIdError(result);
    } else {
      const msg = MessageUtil.buildMessageFromStatusCode(result.status);
      if (msg && msg.length > 0) {
        this.showDanger(result.message);
      } else {
        result.status = StatusCode.Success;
        this.succeed(result);
        UIUtil.showToast(this.insertSuccessMsg);
        this.back(null);
      }
    }
  }
  protected afterUpdate(result: ResultInfo<T>) {
    this.running = false;
    if (result.status === StatusCode.Success) {
      this.succeed(result);
      UIUtil.showToast(this.updateSuccessMsg);
    } else if (result.status === StatusCode.Error) {
      this.fail(result);
    } else {
      const msg = MessageUtil.buildMessageFromStatusCode(result.status);
      if (msg && msg.length > 0) {
        this.showDanger(result.message);
      } else {
        result.status = StatusCode.Success;
        this.succeed(result);
        UIUtil.showToast(this.updateSuccessMsg);
        this.back(null);
      }
    }
  }
  protected handleDuplicatedIdError(result) {
    const msg = ResourceManager.getString('error_duplicated_id');
    result.message = msg;
    this.showDanger(msg);
  }
  protected handleRequiredIdError(result) {
    const msg = ResourceManager.getString('error_required_id');
    result.message = msg;
    this.showDanger(msg);
  }
}
