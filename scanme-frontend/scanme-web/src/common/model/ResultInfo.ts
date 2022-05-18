import {ErrorMessage} from './ErrorMessage';
import {StatusCode} from './StatusCode';

export class ResultInfo<T> {
  value: T;
  status: StatusCode;
  message: string;
  errors: ErrorMessage[];
}
