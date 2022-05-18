import {Locale} from '../locale/model/Locale';
import {DeviceUtil} from '../util/DeviceUtil';
import {FormatUtil} from '../util/FormatUtil';
import {ReflectionUtil} from '../util/ReflectionUtil';
import {UIEventUtil} from '../util/UIEventUtil';
import {UIUtil} from '../util/UIUtil';
import {UIValidationUtil} from '../util/UIValidationUtil';
import {BaseInternalState} from './BaseInternalState';
import {BaseViewComponent} from './BaseViewComponent';
import {HistoryProps} from './HistoryProps';

export class BaseComponent<W extends HistoryProps, I extends BaseInternalState> extends BaseViewComponent<W, I> {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);

    this.dateOnKeyPress = this.dateOnKeyPress.bind(this);
    this.phoneOnKeyPress = this.phoneOnKeyPress.bind(this);

    this.currencyOnFocus = this.currencyOnFocus.bind(this);
    this.checkCurrencyOnBlur = this.checkCurrencyOnBlur.bind(this);
    this.checkRequiredOnBlur = this.checkRequiredOnBlur.bind(this);
    this.checkEmailOnBlur = this.checkEmailOnBlur.bind(this);
    this.checkPhoneOnBlur = this.checkPhoneOnBlur.bind(this);
  }

  protected form: any;
  protected alertClass = '';
  protected subscribeid: any[];

  public componentDidMount() {
    const refForm = this.refs.form;
    if (refForm !== undefined && refForm != null) {
      this.form = refForm;
      if (this.form.getAttribute('date-format') == null) {
        let df = this.dateFormat;
        if (df == null) {
          df = this.getDateFormat();
        }
        this.form.setAttribute('date-format', df);
      }
      // tslint:disable-next-line:only-arrow-functions
      setTimeout(function () {
        UIEventUtil.initMaterial(refForm);
        //  UIUtil.focusFirstControl(refForm);
      }, 50);
      this.init();
    }
    // document.addEventListener('keydown', this.handleSubmitForm);
  }

  public componentWillUnmount() {
    if (this.subscribeid) {
      this.subscribeid.forEach(item => {
        item.unsubscribe();
      });
    }
    // document.removeEventListener('keydown', this.handleSubmitForm);
  }

  /*
  protected handleSubmitForm(e) {
    if (e.which === 13) {
      if (document.getElementById('sysAlert').style.display !== 'none') {
        document.getElementById('sysYes').click();
      } else {
        document.getElementById('btnSave').click();
      }
    } else if (e.which === 27) {
      document.getElementById('sysNo').click();
    }
  }
*/
  protected scrollToFocus = (e, isUseTimeOut = false) => {
    try {
      const element = e.target;
      const container = e.target.form.childNodes[1];
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      const middle = absoluteElementTop - (window.innerHeight / 2);
      const scrollTop = container.scrollTop;
      const timeOut = isUseTimeOut ? 300 : 0;
      const browser = DeviceUtil.getBrowser();

      setTimeout(() => {
        if (browser === 'Chrome') {
          const scrollPosition = scrollTop === 0 ? (elementRect.top + 64) : (scrollTop + middle);
          container.scrollTo(0, Math.abs(scrollPosition));
        } else {
          container.scrollTo(0, Math.abs(scrollTop + middle));
        }
      }, timeOut);
    } catch (e) {
      console.log(e);
    }
  }

  prepareCustomData(data) { }

  protected updatePhoneState = (event) => {
    const re = /^[0-9\b]+$/;
    const value = FormatUtil.removePhoneFormat(event.currentTarget.value);
    if (re.test(value) || !value) {
      this.updateState(event);
    } else {
      const splitArr = value.split('');
      let responseStr = '';
      splitArr.forEach(element => {
        if (re.test(element)) {
          responseStr += element;
        }
      });
      event.currentTarget.value = responseStr;
      this.updateState(event);
    }
  }

  protected updateDateState = (name, value) => {
    const props: any = this.props;
    const modelName = this.form.getAttribute('model-name');
    const state = this.state[modelName];
    if (props.setGlobalState) {
      const data = props.shouldBeCustomized ? this.prepareCustomData({ [name]: value }) : { [name]: value };
      props.setGlobalState({ [modelName]: { ...state, ...data } });
    } else {
      this.setState({[modelName]: {...state, [name]: value}});
    }
  }

  protected updateState = (e, callback?: any, locale?: Locale) => {
    const props: any = this.props;
    const ctrl = e.currentTarget;
    const updateStateMethod = props.setGlobalState;
    const modelName = ctrl.form.getAttribute('model-name');
    const propsDataForm = props[modelName];
    const type = ctrl.getAttribute('type');
    const isPreventDefault = type && (['checkbox', 'radio'].indexOf(type.toLowerCase()) >= 0 ? false : true);
    if (isPreventDefault) {
      e.preventDefault();
    }
    if (
      ctrl.nodeName === 'SELECT' &&
      ctrl.value &&
      ctrl.classList.contains('invalid')) {
      UIValidationUtil.removeErrorMessage(ctrl);
    }
    if (updateStateMethod) {
      const form = ctrl.form;
      const formName = form.name;
      const res = UIUtil.getValue(ctrl, locale, e.type);
      if (res.mustChange) {
        const dataField = ctrl.getAttribute('data-field');
        const field = (dataField ? dataField : ctrl.name);
        if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
          const data = props.shouldBeCustomized ? this.prepareCustomData({ [ctrl.name]: res.value }) : { [ctrl.name]: res.value };
          props.setGlobalState({ [formName]: { ...propsDataForm, ...data } });
        } else {
          ReflectionUtil.setValue(propsDataForm, field, ctrl.value);
          props.setGlobalState({ [formName]: { ...propsDataForm } });
        }
      }
    } else {
      const form = ctrl.form;
      if (!!form) {
        if (!!modelName && modelName !== '') {
          const ex = this.state[modelName];
          const dataField = ctrl.getAttribute('data-field');
          const field = (dataField ? dataField : ctrl.name);
          const model = Object.assign({}, ex);
          if (type && type.toLowerCase() === 'checkbox') {
            const ctrlOnValue = ctrl.getAttribute('data-on-value');
            const ctrlOffValue = ctrl.getAttribute('data-off-value');
            const onValue = ctrlOnValue ? ctrlOnValue : true;
            const offValue = ctrlOffValue ? ctrlOffValue : false;

            model[field] = ctrl.checked ? onValue : offValue;
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else if (type && type.toLowerCase() === 'radio') {
            if (field.indexOf('.') < 0 && field.indexOf('[') < 0 ) {
              model[field] = ctrl.value;
            } else {
              ReflectionUtil.setValue(model, field, ctrl.value);
            }
            const objSet = {};
            objSet[modelName] = model;
            if (callback) {
              this.setState(objSet, callback);
            } else {
              this.setState(objSet);
            }
          } else {
            const tloc = (locale ? locale : ctrl.form.locale);
            const data = UIUtil.getValue(ctrl, tloc, e.type);

            if (data.mustChange) {
              if (field.indexOf('.') < 0 && field.indexOf('[') < 0) {
                model[field] = data.value;
              } else {
                ReflectionUtil.setValue(model, field, data.value);
              }
              const objSet = {};
              objSet[modelName] = model;
              if (callback) {
                this.setState(objSet, callback);
              } else {
                this.setState(objSet);
              }
            }
          }
        } else {
          this.updateFlatState(e, callback);
        }
      } else {
        this.updateFlatState(e, callback);
      }
    }
  }

  private updateFlatState(e, callback?, locale?: Locale) {
    const ctrl = e.currentTarget;
    const stateName = ctrl.name;
    const objSet = {};
    const type = ctrl.getAttribute('type');
    if (type && type.toLowerCase() === 'checkbox') {
      if (!!ctrl.id && stateName === ctrl.id) {
        const oldValue = this.state[stateName];
        objSet[stateName] = (oldValue ? !oldValue : true);
        this.setState(objSet);
      } else {
        let value = this.state[stateName];
        value.includes(ctrl.value) ? value = value.filter(v => v !== ctrl.value) : value.push(ctrl.value);
        this.setState({ [ctrl.name]: value });
      }
    } else {
      const tloc = (locale ? locale : ctrl.form.locale);
      const data = UIUtil.getValue(ctrl, tloc, e.type);
      if (data.mustChange) {
        objSet[stateName] = data.value;
        if (callback) {
          this.setState(objSet, callback);
        } else {
          this.setState(objSet);
        }
      }
    }
  }

  protected showInfo = (msg) => {
    this.alertClass = 'alert alert-info';
    this.setState({ _message: msg });
  }

  protected showDanger = (msg) => {
    this.alertClass = 'alert alert-danger';
    this.setState({ _message: msg });
  }

  protected hideMessage = () => {
    this.alertClass = '';
    this.setState({ _message: '' });
  }

  protected showMessage(msg) {
    this.alertClass = 'alert alert-success';
    this.setState({ _message: msg });
  }

  protected showWarning(msg) {
    this.alertClass = 'alert alert-warning';
    this.setState({ _message: msg });
  }

  protected dateOnKeyPress = (event) => {
    event.preventDefault();
    UIEventUtil.dateOnKeyPress(event);
  }

  protected phoneOnKeyPress = (event) => {
    event.preventDefault();
    UIEventUtil.digitOnKeyPress(event);
  }

  protected currencyOnFocus(event) {
    UIEventUtil.currencyOnFocus(event, this);
  }

  protected checkCurrencyOnBlur(event) {
    this.updateState(event);
    UIEventUtil.checkCurrencyOnBlur(event);
  }

  protected checkEmailOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.checkEmailOnBlur(event);
  }

  protected checkUrlOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.checkUrlOnBlur(event);
  }

  /**
   * Check required by attribute
   */
  protected checkRequiredOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.checkRequiredOnBlur(event);
  }

  protected validateOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.validateOnBlur(event);
  }

  protected checkPhoneOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.validatePhoneOnBlur(event);
  }

  protected checkFaxOnBlur = (event) => {
    event.preventDefault();
    UIEventUtil.validatePhoneOnBlur(event);
  }
}
