import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {Item} from '../../../org-bigchaindb-backend/model/Item';
import {MessageFactory} from '../../message-factory/MessageFactory';
import {ErrorMessage} from '../../model/ErrorMessage';
import {ResultInfo} from '../../model/ResultInfo';
import {StatusCode} from '../../model/StatusCode';
import {GenericRepository} from '../../repository/GenericRepository';
import {GenericService} from '../GenericService';
import {DefaultViewService} from './DefaultViewService';

export class DefaultGenericService<T> extends DefaultViewService<T> implements GenericService<T> {
    constructor(protected repository: GenericRepository<T>) {
        super(repository);
    }

    validateObject(obj: T): Observable<ErrorMessage[]> {
        return of(new Array<ErrorMessage>());
    }

    insert(obj: T): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        return this.validateObject(obj).pipe(flatMap((errors: ErrorMessage[]) => {
            if (!!errors && errors.length > 0) {
                result.errors = errors;
                result.value = obj;
                result.status = StatusCode.DataValidationError;
                return of(result);
            } else {
                // TODO check duplicate ID
                return this.executeInsert(obj).pipe(map(t => {
                    result.value = t;
                    result.status = StatusCode.Success;
                    return result;
                }));
            }
        }));
    }

    insertObjects(item: Item[]): Observable<number> {
        let itemArr = [];
        itemArr = item;
        return this.repository.insertObjects(itemArr);
    }

    updateObjects(item: Item[]): Observable<number> {
        let itemArr = [];
        itemArr = item;
        return this.repository.updateObjects(itemArr);
    }

    protected executeInsert(obj: T): Observable<T> {
      // check id, validate ID
      return this.repository.insert(obj);
    }

    update(obj: T): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        console.log('before validate: ' + obj);
        return this.validateObject(obj).pipe(flatMap((errors: ErrorMessage[]) => {
            console.log('after validate');
            if (!!errors && errors.length > 0) {
                result.errors = errors;
                result.value = obj;
                result.status = StatusCode.DataValidationError;
                return of(result);
            } else {
                console.log('before update: ' + obj);
                // TODO check ID Not Found
                return this.executeUpdate(obj).pipe(map(t => {
                    result.value = t;
                    result.status = StatusCode.Success;
                    return result;
                }));
            }
        }));
    }

    protected executeUpdate(obj: T): Observable<T> {
        // check id, validate ID
        return this.repository.update(obj);
    }

    save(obj: T): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        return this.validateObject(obj).pipe(flatMap((errors: ErrorMessage[]) => {
            if (!!errors && errors.length > 0) {
                result.errors = errors;
                result.value = obj;
                result.status = StatusCode.DataValidationError;
                return of(result);
            } else {
                return this.executeSave(obj).pipe(map(t => {
                    result.value = t;
                    result.status = StatusCode.Success;
                    return result;
                }));
            }
        }));
    }

    protected executeSave(obj: T): Observable<T> {
        // check id, validate ID
        return this.repository.save(obj);
    }
/*
    deleteTransaction(id): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        return this.repository.exists(id).pipe(flatMap(existed => {
            if (!existed) {
                result.errors = [MessageFactory.getItemNotExisted()];
                result.status = StatusCode.ItemNotExisted;
                return of(result);
            } else {
                return this.repository.deleteTransaction(id).map(affectedRow => {
                    if (affectedRow > 0) {
                        result.status = StatusCode.Success;
                    } else {
                        result.errors = [MessageFactory.getSystemError()];
                        result.status = StatusCode.SystemError;
                    }
                    return result;
                });
            }
        }));
    }
*/
    delete(id): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        return this.repository.exists(id).pipe(flatMap(existed => {
            if (!existed) {
                result.errors = [MessageFactory.getItemNotExisted()];
                result.status = StatusCode.ItemNotExisted;
                return of(result);
            } else {
                return this.repository.delete(id).pipe(map(affectedRow => {
                    if (affectedRow > 0) {
                        result.status = StatusCode.Success;
                    } else {
                        result.errors = [MessageFactory.getSystemError()];
                        result.status = StatusCode.SystemError;
                    }
                    return result;
                }));
            }
        }));
    }

/*
    deleteByIds(obj: T): Observable<ResultInfo<T>> {
        const result = new ResultInfo<T>();
        return this.repository.exists(obj).pipe(flatMap(existed => {
            if (!existed) {
                result.errors = [MessageFactory.getItemNotExisted()];
                result.status = StatusCode.ItemNotExisted;
                return of(result);
            } else {
                return this.repository.deleteByIds(obj).pipe(map(affectedRow => {
                    if (affectedRow > 0) {
                        result.status = StatusCode.Success;
                    } else {
                        result.errors = [MessageFactory.getSystemError()];
                        result.status = StatusCode.SystemError;
                    }
                    return result;
                }));
            }
        }));
    }
*/
    deleteByIds(ids: any): Observable<number> {
        return this.repository.deleteByIds(ids);
    }

}

