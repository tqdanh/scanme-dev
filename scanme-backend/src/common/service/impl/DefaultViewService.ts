import {Observable} from 'rxjs';
import {Model} from '../../metadata/Model';
import {ViewRepository} from '../../repository/ViewRepository';
import {ViewService} from '../ViewService';
import {AbstractBaseService} from './AbstractBaseService';

export class DefaultViewService<T> extends AbstractBaseService implements ViewService<T> {
  constructor(private viewRepository: ViewRepository<T>) {
    super();
  }

  getMetaData(): Model {
    return this.viewRepository.getMetaData();
  }

  getAll(): Observable<Array<T>> {
    return this.viewRepository.getAll();
  }

  getById(id): Observable<T> {
    return this.viewRepository.getById(id);
  }

  exists(id): Observable<boolean> {
    return this.viewRepository.exists(id);
  }
}
