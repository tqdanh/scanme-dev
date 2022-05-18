import {ofType} from 'redux-observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {DiffModel} from '../../model/DiffModel';
import {SearchModel} from '../../model/SearchModel';
import {GenericSearchDiffApprService} from '../../service/GenericSearchDiffApprService';
import {BaseActionType} from '../action/BaseActionType';
import {GenericSearchDiffApprActionType} from '../action/GenericSearchDiffApprActionType';
import {GenericSearchObservableEpics} from './GenericSearchObservableEpics';

export class GenericSearchDiffApprObservableEpics<T, S extends SearchModel> extends GenericSearchObservableEpics<T, S> {
  constructor(private actionType: GenericSearchDiffApprActionType, private service: GenericSearchDiffApprService<T, S>) {
    super(actionType, service);
    this.checkDiff.bind(this);
    this.approve.bind(this);
    this.reject.bind(this);
  }

  public checkDiff = action$ => action$.pipe(
    ofType(this.actionType.checkDiff),
    mergeMap((action: any) => {
      const { id, callback } = action.payload;
      const {execute, handleError, formatDiffModel} = callback;

      return this.service.checkDiff(id).pipe(
        map((res: DiffModel<T>) => {

          const format = formatDiffModel(res);
          execute(format);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )

  public approve = action$ => action$.pipe(
    ofType(this.actionType.approveType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;
      return this.service.approve(obj).pipe(
        map((res) => {
          execute(true);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        // catchError((error) => handleError(error))
        catchError((error) => {
          execute(false, error);
          return handleError(error);
        })
        );
    })
  )

  public reject = action$ => action$.pipe(
    ofType(this.actionType.rejectType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;
      return this.service.reject(obj).pipe(
        map((res) => {
          execute(true);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        // catchError((error) => handleError(error))
        catchError((error) => {
          execute(false, error);
          return handleError(error);
        })
      );
    })
  )
}
