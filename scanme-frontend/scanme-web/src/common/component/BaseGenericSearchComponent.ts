import {Model} from '../metadata/Model';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {GenericSearchService} from '../service/GenericSearchService';
import {UIEventUtil} from '../util/UIEventUtil';
import {BaseSearchComponent} from './BaseSearchComponent';
import {HistoryProps} from './HistoryProps';
import {SearchPermissionBuilder} from './SearchPermissionBuilder';
import {SearchState} from './SearchState';

export class BaseGenericSearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T> & any> extends BaseSearchComponent<T, S, W, I & any> {
  constructor(props, protected metadata: Model, protected service: GenericSearchService<T, S>, searchPermissionBuilder: SearchPermissionBuilder, autoSearch: boolean = true, listFormId: string = null) {
    super(props, autoSearch, listFormId, searchPermissionBuilder);
    if (props.match) {
      this._id = (props.id ? props.id : props.match.params.id);
    } else {
      this._id = (props['props']['id'] ? props['props']['id'] : props['props'].match.params.id);
    }
  }
  protected listForm: any;
  protected container: any;

  protected _id: any;
  // private _url: any;
  public componentDidMount() {
    const container: any = this.refs.container;
    if (container && container.childNodes.length === 2) {
      this.listForm = container.childNodes[0].querySelector('form');
      const forms = [this.listForm];
      if (container.childNodes[1].childNodes.length === 1) {
        this.form = container.childNodes[1].childNodes[0];
        forms.push(this.form);
      }
      for (const f of forms) {
        if (f.getAttribute('date-format') == null) {
          let df = this.dateFormat;
          if (df == null) {
            df = this.getDateFormat();
          }
          this.form.setAttribute('date-format', df);
        }
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function () {
          UIEventUtil.initMaterial(f);
          //  UIUtil.focusFirstControl(refForm);
        }, 50);
      }
      this.init();
    }
    // document.addEventListener('keydown', this.handleSubmitForm);
  }
  protected setSearchForm(form) {
    this.listForm = form;
  }

  protected getSearchForm(): any {
    if (!this.listForm && this.listFormId) {
      this.listForm = document.getElementById(this.listFormId);
    }
    return this.listForm;
  }

  search(s: S) {
    this.service.search(s).subscribe(
      (sr: SearchResult<T>) => this.showResults(s, sr),
      err => this.handleError(err)
    );
  }
}
