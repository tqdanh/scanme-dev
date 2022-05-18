import {SearchModel} from '../model/SearchModel';
import {SortBuilder} from './SortBuilder';

export class DefaultSortBuilder<S extends SearchModel> implements SortBuilder<S> {
  private DESC = 'DESC';
  buildSort(s: S): any {
    const sort = {};
    if (s.sortField && s.sortField.length > 0) {
      if (s.sortField.indexOf(',') < 0) {
        const sortType = (!s.sortType && this.DESC === s.sortType.toUpperCase() ? -1 : 1);
        sort[s.sortField.trim()] = sortType;
      } else {
        const sorts = s.sortField.split(',');
        for (let i = 0; i < sorts.length; i++) {
          const cfield = sorts[i];
          const params = cfield.split(' ');
          if (params.length > 0) {
            const sortType = (this.DESC === params[1].toLowerCase() ? -1 : 1);
            sort[params[0].trim()] = sortType;
          }
        }
      }
    }
    return sort;
  }
}
