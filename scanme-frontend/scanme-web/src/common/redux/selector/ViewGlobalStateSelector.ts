import {createSelector} from 'reselect';
import {GlobalState} from '../GlobalState';
import {GlobalStateSelector} from './GlobalStateSelector';

export class ViewGlobalStateSelector<G, T> extends GlobalStateSelector<G> {
  constructor(protected formName: string) {
    super();
  }

  selectFormData = createSelector<GlobalState<G>, G, T>(
    this.selectGlobalState,
    (globalState: G) => {
      if (globalState && globalState[this.formName]) {
        return globalState[this.formName];
      }
      return this.createModel();
    }
  );

  protected createModel(): T {
    const model: any = {};
    return model;
  }
}
