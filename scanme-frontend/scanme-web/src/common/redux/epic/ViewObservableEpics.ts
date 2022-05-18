import {ofType} from 'redux-observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ViewService} from '../../service/ViewService';
import {BaseActionType} from '../action/BaseActionType';
import {ViewActionType} from '../action/ViewActionType';
import {DynamicLayoutObservableEpics} from './DynamicLayoutObservableEpics';

export class ViewObservableEpics<T> extends DynamicLayoutObservableEpics<T> {
  constructor(private viewActionType: ViewActionType, private viewService: ViewService<T>) {
    super(viewActionType, viewService);
    this.getById.bind(this);
  }

  getById = action$ => action$.pipe(
    ofType(this.viewActionType.getByIdType),
    mergeMap((action: any) => {
      const { id, callback } = action.payload;
      const {execute, handleError} = callback;

      return this.viewService.getById(id).pipe(
        map((res: T) => {
          execute(res);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )
}
