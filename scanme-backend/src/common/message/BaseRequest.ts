import {RequestHeader} from './RequestHeader';

export class BaseRequest<T> {
  header: RequestHeader;
  data: T;
}
