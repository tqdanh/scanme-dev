import {GlobalState} from './GlobalState';

export interface ReduxState<G, F> extends GlobalState<G> {
  form: any;
  formDataState: F;
}
