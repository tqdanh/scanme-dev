import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {DataLoader} from './DataLoader';

export interface SuggestionService<T> {
  getSuggestion(keyword: string, previousSuggestion: PreviousSuggestion<T>): Observable<Suggestion<T>>;
}

export class PreviousSuggestion<T> {
  previousKeyWord: string;
  result: T[];
}

export class Suggestion<T> {
  response: T[];
  previousSuggestion: PreviousSuggestion<T>;
}

export class DefaultSuggestionService<T> implements SuggestionService<T> {
  constructor(
    private service: DataLoader<T>,
    private max: number,
    private displayField: string = '',
    private valueField: string = '') {
  }

  getSuggestion = (keyword: string, previousSuggestion: PreviousSuggestion<T>, excludingValues: any[] = []): Observable<Suggestion<T>> => {
    if (
      keyword.length > 1 && keyword.startsWith(previousSuggestion.previousKeyWord) &&
      previousSuggestion.result.length < this.max
    ) {
      let response;
      keyword = keyword.toUpperCase();
      if (this.displayField !== '') {
        response = previousSuggestion.result.filter(item => item[this.displayField].toUpperCase().includes(keyword));
      } else {
        response = previousSuggestion.result.filter(item => String(item).toUpperCase().includes(keyword));
      }
      return of({ response, previousSuggestion });
    } else {
      return this.service.loadData(keyword, this.max).pipe(map((response: any[]) => {
        if (excludingValues.length > 0) {
          if (this.valueField !== '') {
            response = response.filter(obj => !excludingValues.find(item => obj[this.valueField] === item));
          } else {
            response = response.filter(obj => !excludingValues.find(item => obj === item));
          }
        }
        previousSuggestion.previousKeyWord = keyword;
        previousSuggestion.result = response;
        return { response, previousSuggestion };
      }));
    }
  }
}
