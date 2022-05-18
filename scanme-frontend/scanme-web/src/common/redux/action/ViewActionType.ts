import {DynamicActionType} from './DynamicActionType';

export interface ViewActionType extends DynamicActionType {
  getByIdType: string;
}
