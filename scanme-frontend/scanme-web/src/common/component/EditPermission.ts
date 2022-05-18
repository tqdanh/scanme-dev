import {ViewPermission} from './ViewPermission';

export interface EditPermission extends ViewPermission {
  addable: boolean;
  editable: boolean;
  deletable?: boolean;
}
