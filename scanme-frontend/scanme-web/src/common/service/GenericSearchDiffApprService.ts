import {SearchModel} from '../model/SearchModel';
import {DiffApprService} from './DiffApprService';
import {GenericSearchService} from './GenericSearchService';

export interface GenericSearchDiffApprService<T, S extends SearchModel> extends GenericSearchService<T, S>, DiffApprService<T> {

}
