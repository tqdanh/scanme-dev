import {Model} from '../metadata/Model';
import {ResultInfo} from '../model/ResultInfo';
import {ResourceManager} from '../ResourceManager';
import {GenericService} from '../service/GenericService';
import {storage} from '../storage';
import {ReflectionUtil} from '../util/ReflectionUtil';
import {UIUtil} from '../util/UIUtil';
import {BaseEditComponent} from './BaseEditComponent';
import {BaseInternalState} from './BaseInternalState';
import {EditPermissionBuilder} from './EditPermissionBuilder';
import {HistoryProps} from './HistoryProps';

export abstract class EditComponent<T, W extends HistoryProps, I extends BaseInternalState> extends BaseEditComponent<T, W, I>  {
  constructor(props, protected service: GenericService<T>, permissionBuilder: EditPermissionBuilder) {
    super(props, service.getMetaData(), permissionBuilder);
  }

  componentWillUnmount() {
    if  (this.props[this.getModelName()]) {
      const props: any = this.props;
      const setGlobalState = props.props.setGlobalState;
      const form = this.getForm();
      if (form) {
        const formName: string = form.name;
        setGlobalState(formName);
      }
    }
  }

  loadData() {
    const id = this.getId();
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
    } else {
      // Call service state
      const obj = this.createModel();
      this.setNewMode(true);
      this.formatModel(obj);
      this.orginalModel = null;
      this.showModel(obj);
    }
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

  protected save(obj, diff?: any) {
    this.running = true;
    const com = this;
    if (this.isNewMode() === false) {
      if (this.patchable === true) {
        const body = this.makePatchBodyFromDiff(diff);
        this.service.patch(obj, body).subscribe((result: ResultInfo<T>) => {
          com.afterUpdate(result);
        }, this.handleError);
      } else {
        if (this.props[this.getModelName()]) {
          this.service.update({obj, callback: { execute: this.afterUpdate, handleError: this.handleError }});
        } else {
          this.service.update(obj).subscribe((result: ResultInfo<T>) => {
            com.afterUpdate(result);
          }, this.handleError);
        }
      }
    } else {
      if (this.props[this.getModelName()]) {
        this.service.insert({obj, callback: { execute: this.afterInsert, handleError: this.handleError }});
      } else {
        this.service.insert(obj).subscribe((result: ResultInfo<T>) => {
          com.afterInsert(result);
        }, this.handleError);
      }
    }
  }
}
