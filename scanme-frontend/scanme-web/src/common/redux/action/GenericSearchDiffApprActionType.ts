import {DiffApprActionType} from './DiffApprActionType';
import {GenericActionType} from './GenericActionType';
import {SearchActionType} from './SearchActionType';

export interface GenericSearchDiffApprActionType extends GenericActionType, SearchActionType, DiffApprActionType {

}
