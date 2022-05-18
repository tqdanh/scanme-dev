import {ViewActionType} from './ViewActionType';

export interface GenericActionType extends ViewActionType {
  updateType: string;
  insertType: string;
}
