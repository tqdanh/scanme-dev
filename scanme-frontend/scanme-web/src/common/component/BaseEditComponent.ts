import {Model} from '../metadata/Model';
import {MetadataUtil} from '../metadata/util/MetadataUtil';
import {ResultInfo} from '../model/ResultInfo';
import {StatusCode} from '../model/StatusCode';
import {ResourceManager} from '../ResourceManager';
import {storage} from '../storage';
import {MessageUtil} from '../util/MessageUtil';
import {ReflectionUtil} from '../util/ReflectionUtil';
import {UIUtil} from '../util/UIUtil';
import {UIValidationUtil} from '../util/UIValidationUtil';
import {BaseComponent} from './BaseComponent';
import {BaseInternalState} from './BaseInternalState';
import {EditPermissionBuilder} from './EditPermissionBuilder';
import {HistoryProps} from './HistoryProps';
import {IdBuilder} from './IdBuilder';

export abstract class BaseEditComponent<T, W extends HistoryProps, I extends BaseInternalState> extends BaseComponent<W, I> {
  constructor(props, protected metadata: Model, protected permissionBuilder: EditPermissionBuilder) {
    super(props);
    if (props.match) {
      this._url = props.match.url;
      this._id = (props.id ? props.id : props.match.params.id);
    } else {
      this._url = props['props'].match.url;
      this._id = (props['props']['id'] ? props['props']['id'] : props['props'].match.params.id);
    }
    this.setForm = this.setForm.bind(this);
    this.getForm = this.getForm.bind(this);
    this.saveModelToState = this.saveModelToState.bind(this);
    this.afterInsert = this.afterInsert.bind(this);
    this.afterUpdate = this.afterUpdate.bind(this);
    if (metadata) {
      setTimeout(() => {
        const meta = MetadataUtil.getMetaModel(metadata);
        if (meta.objectFields && meta.arrayFields && meta.objectFields.length > 0 && meta.arrayFields.length > 0) {
          this.patchable = false;
        } else {
          this.patchable = true;
        }
      }, 1000);
    }
  }

  private newMode = false;
  protected setBack = false;
  protected patchable = false;
  protected orginalModel: T;

  protected viewable = true;
  protected addable: boolean;
  protected editable: boolean;
  protected orginalModelRedux = null;

  insertSuccessMsg: string = ResourceManager.getString('msg_save_success');
  updateSuccessMsg: string = ResourceManager.getString('msg_save_success');

  // can be in ViewComponent
  private _id: any;
  private _url: any;
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
    throw new Error('Must implement saveModelToState method');
  }

  protected getModelFromState(): any {
    throw new Error('getModelFromState');
  }
  // end of: can be in ViewComponent

  initPermission() {
    if (this.permissionBuilder) {
      const permission = this.permissionBuilder.buildPermission(storage.getUser(), this._url);
      this.viewable = permission.viewable;
      this.addable = permission.addable;
      this.editable = permission.editable;
    } else {
      this.viewable = false;
      this.addable = false;
      this.editable = false;
    }
  }

  setNewMode(_newMode: boolean) {
    this.newMode = _newMode;
  }
  isNewMode(): boolean {
    return this.newMode;
  }

  protected setForm(form) {
    this.form = form;
  }

  protected getForm(): any {
    return this.form;
  }

  protected createModel(): T {
    const obj = MetadataUtil.createModel(this.metadata);
    return obj;
  }

  newOnClick = (event) => {
    if (event) {
      event.preventDefault();
    }
    const obj = this.createModel();
    this.setNewMode(true);
    this.orginalModel = null;
    this.showModel(obj);
    setTimeout(() => {
      if (event) {
        const form = event.target.form;
        UIValidationUtil.removeFormError(form);
      } else {
        const form = this.getForm();
        UIValidationUtil.removeFormError(form);
      }
    }, 100);
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
    const valid = UIValidationUtil.validateForm(this.getForm());
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
