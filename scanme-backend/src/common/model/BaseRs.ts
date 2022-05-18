import { ErrorDescription } from './ErrorDescription';
import { StatusEnum } from './StatusEnum';

export class BaseRs {
  errors: ErrorDescription[];
  status: StatusEnum;
}
