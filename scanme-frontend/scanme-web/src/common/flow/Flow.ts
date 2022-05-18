import {FormConfig} from './FormConfig';

export interface Flow {
  id: string;
  startPoint: string;
  storage?: any;
  env?: any;
  forms: FormConfig[];
}
