import {ofType} from 'redux-observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ResultInfo} from '../../model/ResultInfo';
import {GenericService} from '../../service/GenericService';
import {BaseActionType} from '../action/BaseActionType';
import {GenericActionType} from '../action/GenericActionType';
import {ViewObservableEpics} from './ViewObservableEpics';

export class GenericObservableEpics<T> extends ViewObservableEpics<T> {
  constructor(private genericActionType: GenericActionType, private genericService: GenericService<T>) {
    super(genericActionType, genericService);
    this.update.bind(this);
    this.insert.bind(this);
  }

  update = action$ => action$.pipe(
    ofType(this.genericActionType.updateType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;
      return this.genericService.update(obj).pipe(
        map((res: ResultInfo<T>) => {
          execute(res);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )

  insert = action$ => action$.pipe(
    ofType(this.genericActionType.insertType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;
      return this.genericService.insert(obj).pipe(
        map((res: ResultInfo<T>) => {
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
