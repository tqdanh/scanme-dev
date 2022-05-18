import {InitModel} from '../../InitModel';
import {AtLeastOne} from './AtLeastOneType';
import {FormDataStateActionType} from './FormDataStateActionType';
import {GlobalStateActionType} from './GlobalStateActionType';
import {ReducerActionType} from './ReducerActionType';

function createAction<T extends ReducerActionType<GlobalStateActionType | FormDataStateActionType>>(d: T): T {
  return d;
}

export const initData = (jsonObject: InitModel) => createAction({
  type: GlobalStateActionType.INIT_DATA,
  payload: jsonObject
});

export function setFormDataAction<T, K extends keyof T>(formName: K, data: AtLeastOne<T[K]>) {
  return createAction({
    type: FormDataStateActionType.SET_FORM_DATA,
    payload: {
      formName,
      data
    }
  });
}

export const actionFormDataState = {
  setFormDataAction
};

export function updateGlobalState<T>(data: Partial<T>) {
  return createAction({
    type: GlobalStateActionType.UPDATE_GLOBAL_STATE,
    payload: data
  });
}

export const actionsGlobalState = {
  initData,
  updateGlobalState
};
