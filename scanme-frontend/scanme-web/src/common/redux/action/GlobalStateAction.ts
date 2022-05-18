import {actionsGlobalState} from './actions';

type actionsTypeGlobalState = typeof actionsGlobalState;

export type GlobalStateAction = ReturnType<actionsTypeGlobalState[keyof actionsTypeGlobalState]>;
