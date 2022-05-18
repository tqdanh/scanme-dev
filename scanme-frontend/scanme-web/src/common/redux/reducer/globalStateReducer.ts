import {GlobalStateAction} from '../action/GlobalStateAction';
import {GlobalStateActionType} from '../action/GlobalStateActionType';

function initGlobalState<T extends object>(): T {
  const t: any = {};
  return t;
}

export function globalStateReducer<T extends object>(state: T = initGlobalState(), action: GlobalStateAction) {
  switch (action.type) {
    case GlobalStateActionType.INIT_DATA:
      return { ...(state as object), initData: action.payload };
    case GlobalStateActionType.UPDATE_GLOBAL_STATE:
      if (typeof action.payload === 'string') {
        delete state[action.payload];
        return state;
      } else {
        return { ...(state as object), ...action.payload };
      }
    default:
      return state;
  }
}
