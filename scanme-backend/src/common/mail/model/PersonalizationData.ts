import {EmailData} from './EmailData';

export interface PersonalizationData {
  to: EmailData | EmailData[];
  cc?: EmailData | EmailData[];
  bcc?: EmailData | EmailData[];
  subject?: string;
  headers?: { [key: string]: string };
  substitutions?: { [key: string]: string };
  dynamicTemplateData?: { [key: string]: string; };
  customArgs?: { [key: string]: string };
  sendAt?: number;
}
