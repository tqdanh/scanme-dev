import {ComponentConfig} from '../config/ComponentConfig';
import {ValidationConfig} from './ValidationConfig';

export interface FormConfig {
  name: string;
  alias?: string;
  acceptState?: string;
  env?: any;
  messages?: any;
  components: ComponentConfig[];
  validationConfigs: ValidationConfig[];
  logConfig?: LogConfig;
}

export interface LogConfig {
  viewTracking?: boolean; // used for Google view tracking for analytics
  cancelTracking?: boolean; // used for cancel event
  emailEditTracking?: boolean;
  contactAddressTracking?: boolean;
  workAddressTracking?: boolean;
}
