import * as qs from 'query-string';
import {LocaleModelFormatter} from '../formatter/LocaleModelFormatter';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {ResourceManager} from '../ResourceManager';
import {storage} from '../storage';
import {MessageUtil} from '../util/MessageUtil';
import {SearchUtil} from '../util/SearchUtil';
import {StringUtil} from '../util/StringUtil';
import {UIUtil} from '../util/UIUtil';
import {UIValidationUtil} from '../util/UIValidationUtil';
import {ValidationUtil} from '../util/ValidationUtil';
import {BaseComponent} from './BaseComponent';
import {HistoryProps} from './HistoryProps';
import {SearchPermissionBuilder} from './SearchPermissionBuilder';
import {SearchState} from './SearchState';

export class BaseSearchComponent<T, S extends SearchModel, W extends HistoryProps, I extends SearchState<T> & any> extends BaseComponent<W, I & any> {
  constructor(props, protected autoSearch: boolean = true, protected listFormId: string, protected permissionBuilder: SearchPermissionBuilder) {
    super(props);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.setSearchForm = this.setSearchForm.bind(this);
    this.add = this.add.bind(this);
    this.searchOnClick = this.searchOnClick.bind(this);
    this.sort = this.sort.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
    this.pageSizeChanged = this.pageSizeChanged.bind(this);
    this.clearKeywordOnClick = this.clearKeywordOnClick.bind(this);
    this.mergeUrlSearchModelToState = this.mergeUrlSearchModelToState.bind(this);
    this.showResults = this.showResults.bind(this);
    this.searchError = this.searchError.bind(this);
    this._url = (props.match ? props.match.url : props['props'].match.url);

    const location = (props.location ? props.location : props['props'].location);
    if (location && location.search) {
      const parsed = qs.parse(location.search);
      if (ValidationUtil.isDigitOnly(parsed.pageIndex as string)) {
        const pageIndex = parseInt(parsed.pageIndex as string, 0);
        if (pageIndex >= 1) {
          this.pageIndex = pageIndex;
        }
      }
      if (ValidationUtil.isDigitOnly(parsed.pageSize as string)) {
        const pageSize = parseInt(parsed.pageSize as string, 0);
        if (pageSize > 0) {
          this.pageSize = pageSize;
        }
      }
      if (ValidationUtil.isDigitOnly(parsed.initPageSize as string)) {
        const initPageSize = parseInt(parsed.initPageSize as string, 0);
        if (initPageSize > 0) {
          this.initPageSize = initPageSize;
        }
      }
      delete parsed.pageIndex;
      delete parsed.pageSize;
      delete parsed.initPageSize;
      this.urlSearchModel = parsed;
    }
  }

  formatter: LocaleModelFormatter<any, any>;
  tagName: string;
  protected _url: any;
  protected running: boolean;
  // displayFields: any[];
  // displayFieldNames: string;
  _triggerSearch = false;
  _loaded = false;
  _ignoreUrlParam = false;
  showPaging = false;
  appendMode = false;
  appendable = false;
  pageMaxSize = 7;
  _tmpPageIndex: number;
  _bkpageIndex: number;
  _lastSearchedTime: any = null;

  pageIndex = 1;
  pageSize = 10;
  excluding: any;
  initPageSize = 5;
  pageSizes: number[] = [5, 10, 20, 50, 100, 200, 500, 1000];
  pageTotal: number;
  itemTotal: number;
  sortField: string;
  // _currentSortField: string;
  sortType: string;
  _sortTarget: any;
  append = false;
  hideFilter: boolean;

  searchable = true;
  viewable: boolean;
  addable: boolean;
  editable: boolean;
  deletable: boolean;
  approvable: boolean;
  currentPage: number;

  private list: any[];
  private urlSearchModel: any;

  protected mergeUrlSearchModelToState() {
    const searchModel = this.urlSearchModel;
    if (!!searchModel) {
      for (const key of Object.keys(searchModel)) {
        if (searchModel[key] !== '') {
          searchModel[key] = Array.isArray(this.state[key]) ?
            searchModel[key].split(',') :
            searchModel[key];
        } else {
          searchModel[key] = Array.isArray(this.state[key]) ?
            [] : searchModel[key];
        }
      }
      this.setState(searchModel);
    }
  }

  protected add = (event) => {
    event.preventDefault();
    const url = this.props['props'].match.url + '/add';
    this.props.history.push(url);
  }

  initPermission() {
    if (this.permissionBuilder) {
      const permission = this.permissionBuilder.buildPermission(storage.getUser(), this._url);
      this.searchable = permission.searchable;
      this.viewable = permission.viewable;
      this.addable = permission.addable;
      this.editable = permission.editable;
      this.approvable = permission.approvable;
      this.deletable = permission.deletable;
    } else {
      this.searchable = true;
      this.viewable = false;
      this.addable = false;
      this.editable = false;
      this.approvable = false;
      this.deletable = false;
    }
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
      }, 0);
    }
  }

  protected setSearchForm(form) {
    this.form = form;
  }

  protected getSearchForm(): any {
    if (!this.form && this.listFormId) {
      this.form = document.getElementById(this.listFormId);
    }
    return this.form;
  }

  getSearchModel(): S {
    const s = this.populateSearchModel();
    return s;
  }
  protected populateSearchModel(): S {
    let obj = UIUtil.decodeFromForm(this.getSearchForm());
    obj = obj ? obj : {};
    if (this.tagName != null && this.tagName !== undefined) {
      obj.tagName = this.tagName;
    }
    // obj.fields = this.getDisplayFields();
    if (this.pageIndex != null && this.pageIndex >= 1) {
      obj.pageIndex = this.pageIndex;
    } else {
      obj.pageIndex = 1;
    }
    obj.pageSize = this.pageSize;
    if (this.appendMode === true) {
      obj.initPageSize = this.initPageSize;
    }
    obj.sortField = this.sortField;
    obj.sortType = this.sortType;
    obj.pageSize = this.pageSize;
    obj.excluding = this.excluding;
    return obj;
  }

  protected pagingOnClick = (size, e) => {
    this.setState(prevState => ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }));
    this.pageSizeChanged(size);
  }

  protected pageSizeOnClick = () => {
    this.setState(prevState => ({ isPageSizeOpenDropDown: !prevState.isPageSizeOpenDropDown }));
  }

  protected clearKeywordOnClick = () => {
    this.setState({
      keyword: ''
    });
  }
  searchOnClick(event) {
    event.preventDefault();
    this._loaded = true;
    if (event) {
      this.setSearchForm(event.target.form);
    }
    this.resetAndSearch();
  }

  resetAndSearch() {
    this.currentPage = 1;
    if (this.running === true) {
      this._triggerSearch = true;
      return;
    }
    if (this._sortTarget != null) {
      if (this._sortTarget.children.length > 0) {
        this._sortTarget.removeChild(this._sortTarget.children[0]);
      }
      this._sortTarget = null;
    }
    this._lastSearchedTime = null;
    this.sortField = null;
    this.append = false;
    this._tmpPageIndex = 1;
    this.pageIndex = 1;
    this.doSearch();
  }

  doSearch(isFirstLoad?: boolean) {
    if (this.searchable !== true) {
      const title = ResourceManager.getString('error_permission');
      const msg = ResourceManager.getString('error_permission_search');
      UIUtil.alertError(msg, title);
      const user = storage.getUser();
      if (user != null) {
        this.navigateToHome();
      } else {
        this.requireAuthentication();
      }
      return;
    } else {
      const listForm = this.getSearchForm();
      if (listForm) {
        UIValidationUtil.removeFormError(listForm);
      }
      const s = this.getSearchModel();
      const com = this;
      // this.search(s);
      this.validateSearch(s, (s2) => {
        if (com.running === true) {
          return;
        }
        com.running = true;
        // com.showLoading();
        if (this._ignoreUrlParam === false) {
          SearchUtil.addParametersIntoUrl(s2, isFirstLoad);
        }
        com.search(s2);
      });
    }
  }

  search(s: SearchModel) {
    // override by child service implementation
  }

  // tslint:disable-next-line:ban-types
  protected validateSearch(s: S, callback: Function) {
    let valid = true;
    const listForm = this.getSearchForm();
    if (listForm) {
      valid = UIValidationUtil.validateForm(listForm);
    }
    if (valid === true) {
      callback(s);
    }
  }
  protected searchError(err) {
    this.pageIndex = this._tmpPageIndex;
    this.handleError(err);
  }
  showResults(s: SearchModel, sr: SearchResult<T>) {
    const com = this;
    if (sr.itemTotal !== null || sr.itemTotal !== undefined) {
      com.itemTotal = sr.itemTotal;
    }
    com.pageIndex = s.pageIndex;
    const results = sr.results;
    if (results != null && results.length > 0) {
      com.formatResults(results);
    }
    if (com.appendMode === false) {
      com.setList(results);
      com._tmpPageIndex = s.pageIndex;
      com.itemTotal = sr.itemTotal;
      const pageTotal = SearchUtil.getPageTotal(sr.itemTotal, s.pageSize);
      com.pageTotal = pageTotal;
      com.showPaging = (com.pageTotal <= 1 ? false : true);
      com.showToast(MessageUtil.buildSearchMessage(s, sr));
    } else {
      if (s.pageSize === 0) {
        com.appendable = false;
      } else {
        let pageSize = s.pageSize;
        if (s.pageIndex <= 1) {
          pageSize = s.initPageSize;
        }
        if (sr.lastPage === true || results.length < pageSize) {
          com.appendable = false;
        } else {
          com.appendable = true;
        }
      }
      if (com.append === true && s.pageIndex > 1) {
        com.appendList(results);
      } else {
        com.setList(results);
      }
      if (results.length === 0) {
        com.appendable = false;
      }
    }
    // this.changeUrlParams()
    com.running = false;
    // this.hideLoading();
    if (com._triggerSearch === true) {
      com._triggerSearch = false;
      com.resetAndSearch();
    }
  }

  protected formatResults(results: any[]) {
    if (results && results.length > 0) {
      let hasSequencePro = false;
      if (this.formatter) {
        for (const obj of results) {
          if (obj.sequenceNo) {
            hasSequencePro = true;
          }
          this.formatter.format(obj, null);
        }
      } else {
        for (const obj of results) {
          if (obj.sequenceNo) {
            hasSequencePro = true;
          }
        }
      }
      if (!hasSequencePro) {
        for (let i = 0; i < results.length; i++) {
          results[i].sequenceNo = i - this.pageSize + this.pageSize * this.pageIndex + 1;
        }
      }
    }
  }

  appendList(results: T[]) {
    const list = this.state.results;
    const length = results.length;
    const props: any = this.props;
    const setGlobalState = props.props.setGlobalState;

    for (let i = 0; i < length; i++) {
      list.push(results[i]);
    }
    const listForm = this.getSearchForm();
    if (setGlobalState && listForm) {
      setGlobalState({ [listForm.name]: list });
    } else {
      this.setState({ results: list });
    }
  }

  setList(results: T[]) {
    const props: any = this.props;
    const setGlobalState = props.props.setGlobalState;
    this.list = results;
    const listForm = this.getSearchForm();
    if (setGlobalState && listForm) {
      setGlobalState({ [listForm.name]: results });
    } else {
      this.setState({ results });
    }
  }

  getList(): T[] {
    return this.list;
  }

  sort = (event) => {
    event.preventDefault();
    if (event != null && event.target != null) {
      let target = event.target;
      let field = target.getAttribute('data-field');
      if (!field) {
        field = target.parentNode.getAttribute('data-field');
      }
      if (!field || field.length === 0) {
        return;
      }
      const sortType = target.getAttribute('sort-type');
      if (target.nodeName === 'I') {
        target = target.parentNode;
      }
      let i = null;
      if (target.children.length === 0) {
        target.innerHTML = target.innerHTML + '<i class="sort-up"></i>';
      } else {
        i = target.children[0];
        if (i.classList.contains('sort-up')) {
          i.classList.remove('sort-up');
          i.classList.add('sort-down');
        } else if (i.classList.contains('sort-down')) {
          i.classList.remove('sort-down');
          i.classList.add('sort-up');
        }
      }
      if (!this.sortField || this.sortField === '') {
        this.sortField = field;
        this.sortType = 'ASC';
      } else if (this.sortField !== field) {
        this.sortField = field;
        this.sortType = (!sortType ? 'ASC' : sortType);
        if (this._sortTarget != null && this._sortTarget.children.length > 0) {
          this._sortTarget.removeChild(this._sortTarget.children[0]);
        }
      } else if (this.sortField === field) {
        if (this.sortType === 'ASC') {
          this.sortType = 'DESC';
        } else {
          this.sortType = 'ASC';
        }
      }
      this._sortTarget = target;
    }
    /* else {
       this.sortField = field;
       if (!this.sortType || this._currentSortField !== this.sortField || this.sortType === 'DESC') {
         this.sortType = 'ASC';
       } else {
         this.sortType = 'DESC';
       }

       this._currentSortField = ReflectionUtil.clone(this.sortField);
       } */
    this._lastSearchedTime = null;
    this.setList(null);
    if (this.appendMode === false) {
      this.doSearch();
    } else {
      this.resetAndSearch();
    }
  }

  pageSizeChanged = (event) => {
    this._lastSearchedTime = new Date();
    const size = parseInt(event.target.value, null);
    this.initPageSize = size;
    this.pageSize = size;
    this._tmpPageIndex = 1;
    this.pageIndex = 1;
    this.currentPage = 1;
    this._bkpageIndex = this.pageIndex;
    this.doSearch();
  }

  pageChanged(data) {
    // if (this._loaded === false) {
    //   return;
    // }
    const { currentPage, itemsPerPage, totalPages, maxSize } = data;
    if (this._lastSearchedTime != null) {
      const now: any = new Date();
      const xbug = Math.abs(this._lastSearchedTime - now);
      if (xbug < 800) {
        this.pageIndex = this._bkpageIndex;
        return;
      }
    }
    this.pageIndex = currentPage;
    this.pageSize = itemsPerPage;
    this.append = false;
    this.currentPage = currentPage;
    this.doSearch();
  }

  pageIndexTableChanged(pageIndex) {
    this._lastSearchedTime = new Date();
    this.pageIndex = pageIndex;
    this.currentPage = pageIndex;
    this._bkpageIndex = pageIndex;
    this.doSearch();
  }
}
