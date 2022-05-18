import {actionFormDataState} from './actions';

type actionsTypeFormData = typeof actionFormDataState;

export type FormDataAction = ReturnType<actionsTypeFormData[keyof actionsTypeFormData]>;

