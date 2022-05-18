import {ApprService} from './ApprService';
import {DiffService} from './DiffService';

export interface DiffApprService<T> extends DiffService<T>, ApprService<T> {

}
