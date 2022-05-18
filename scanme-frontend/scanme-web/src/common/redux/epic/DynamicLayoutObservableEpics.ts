import {ofType} from 'redux-observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {ResultInfo} from '../../model/ResultInfo';
import {DynamicLayoutService} from '../../service/DynamicLayoutService';
import {BaseActionType} from '../action/BaseActionType';
import {DynamicActionType} from '../action/DynamicActionType';

export class DynamicLayoutObservableEpics<T> {
  constructor(private dynamicActionType: DynamicActionType, private dynamicLayoutService: DynamicLayoutService<T>) {
    this.getAllDynamicForm.bind(this);
    this.getDynamicFormByModelName.bind(this);
    this.getDynamicFormById.bind(this);
    this.insertDynamicForm.bind(this);
    this.updateDynamicForm.bind(this);
    this.deleteDynamicForm.bind(this);
  }

  getAllDynamicForm = action$ => action$.pipe(
    ofType(this.dynamicActionType.getAllDynamicFormType),
    mergeMap((action: any) => {
      const { s, callback } = action.payload;
      const { results, handleError } = callback;

      return this.dynamicLayoutService.getAllDynamicForm(s).pipe(
        map((list: any) => {
          results(s, list);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )

  getDynamicFormByModelName = action$ => action$.pipe(
    ofType(this.dynamicActionType.getDynamicFormByModelNameType),
    mergeMap((action: any) => {
      const { name, callback } = action.payload;
      const { execute, handleError } = callback;

      return this.dynamicLayoutService.getDynamicFormByModelName(name).pipe(
        map((res: T) => {
          execute({res});
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )

  getDynamicFormById = action$ => action$.pipe(
    ofType(this.dynamicActionType.getDynamicFormByIdType),
    mergeMap((action: any) => {
      const { id, callback } = action.payload;
      const { execute, handleError } = callback;

      return this.dynamicLayoutService.getDynamicFormById(id).pipe(
        map((res: T) => {
          execute({res});
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )

  updateDynamicForm = action$ => action$.pipe(
    ofType(this.dynamicActionType.updateDynamicFormType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;

      return this.dynamicLayoutService.updateDynamicForm(obj).pipe(
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

  insertDynamicForm = action$ => action$.pipe(
    ofType(this.dynamicActionType.insertDynamicFormType),
    mergeMap((action: any) => {
      const { obj, callback } = action.payload;
      const { execute, handleError } = callback;
      return this.dynamicLayoutService.insertDynamicForm(obj).pipe(
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

  deleteDynamicForm = action$ => action$.pipe(
    ofType(this.dynamicActionType.deleteDynamicFormType),
    mergeMap((action: any) => {
      const { id, callback } = action.payload;
      const { execute, handleError, data } = callback;
      return this.dynamicLayoutService.deleteDynamicForm(id).pipe(
        map((res: ResultInfo<T>) => {
          execute(data);
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )
}
