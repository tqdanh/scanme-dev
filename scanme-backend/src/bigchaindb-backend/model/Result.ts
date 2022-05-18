import {StatusCode} from './StatusCode';

export class Result<T> {
    status: StatusCode;
    model: T;
}
