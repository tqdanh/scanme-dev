import {Model} from '../metadata/Model';
import {ResourceManager} from '../ResourceManager';
import {ViewService} from '../service/ViewService';
import {storage} from '../storage';
import {LoadingUtil} from '../util/LoadingUtil';
import {UIUtil} from '../util/UIUtil';
import {BaseInternalState} from './BaseInternalState';
import {BaseViewComponent} from './BaseViewComponent';
import {HistoryProps} from './HistoryProps';
import {IdBuilder} from './IdBuilder';

export class ViewComponent<T, W extends HistoryProps, I extends BaseInternalState> extends BaseViewComponent<W, I> {
  constructor(props, protected metadata: Model, private viewService: ViewService<T>) {
    super(props);
  }

  private _id: any;
  protected form: any;
  protected viewable = true;

  protected getModelName() {
    return (this.metadata ? this.metadata.name : '');
  }

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

  loadData() {
    const id = this.getId();
    if (id != null && id !== '') {
      if (this.viewable !== true) {
        const title = ResourceManager.getString('error');
        const msg = ResourceManager.getString('error_permission_view');
        UIUtil.alertError(msg, title);
        const user = storage.getUser();
        if (!!user) {
          this.navigateToHome();
        } else {
          this.requireAuthentication();
        }
        return;
      } else {
        this.running = true;
        LoadingUtil.showLoading();
        this.viewService.getById(id).subscribe(obj => {
          this.formatModel(obj);
          this.showModel(obj);
          this.running = false;
          LoadingUtil.hideLoading();
        }, err => this.handleError(err));
      }
    }
  }

  protected formatModel(obj): any {
    return obj;
  }

  getModel(): T {
    return this.getModelFromState();
  }

  showModel(model: T) {
    this.saveModelToState(model);
  }

  protected saveModelToState(model: T) {
    const modelName = this.getModelName();
    const objSet: any = {};
    objSet[modelName] = model;
    this.setState(objSet);
  }

  protected getModelFromState() {
    return this.state[this.getModelName()];
  }
}
