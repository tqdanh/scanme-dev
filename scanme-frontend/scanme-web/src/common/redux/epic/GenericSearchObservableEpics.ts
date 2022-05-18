import {ofType} from 'redux-observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {SearchModel} from '../../model/SearchModel';
import {GenericSearchService} from '../../service/GenericSearchService';
import {BaseActionType} from '../action/BaseActionType';
import {GenericSearchActionType} from '../action/GenericSearchActionType';
import {GenericObservableEpics} from './GenericObservableEpics';

export class GenericSearchObservableEpics<T, S extends SearchModel> extends GenericObservableEpics<T> {
  constructor(private genericSearchActionType: GenericSearchActionType, private genericSearchService: GenericSearchService<T, S>) {
    super(genericSearchActionType, genericSearchService);
    this.search.bind(this);
  }

  search = action$ => action$.pipe(
    ofType(this.genericSearchActionType.searchType),
    mergeMap((action: any) => {
      const { s, callback } = action.payload;
      const {results, handleError} = callback;
      return this.genericSearchService.search(s).pipe(
        map((list) => {
          results(s, list );
          return ({
            type: BaseActionType.ACTION_SUCCESS
          });
        }),
        catchError((error) => handleError(error))
      );
    })
  )
}
