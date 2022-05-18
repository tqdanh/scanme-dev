import {ASMOptions} from './ASMOptions';
import {AttachmentData} from './AttachmentData';
import {EmailData} from './EmailData';
import {MailContent} from './MailContent';
import {MailSettings} from './MailSettings';
import {PersonalizationData} from './PersonalizationData';
import {TrackingSettings} from './TrackingSettings';

export interface MailData {
  to?: EmailData|EmailData[];
  cc?: EmailData|EmailData[];
  bcc?: EmailData|EmailData[];

  from: EmailData;
  replyTo?: EmailData;

  sendAt?: number;

  subject?: string;
  text?: string;
  html?: string;
  content?: MailContent[];
  templateId?: string;

  personalizations?: PersonalizationData[];
  attachments?: AttachmentData[];

  ipPoolName?: string;
  batchId?: string;

  sections?: { [key: string]: string };
  headers?: { [key: string]: string };

  categories?: string[];
  category?: string;

  customArgs?: { [key: string]: any };
  asm?: ASMOptions;

  mailSettings?: MailSettings;
  trackingSettings?: TrackingSettings;

  substitutions?: { [key: string]: string };
  substitutionWrappers?: string[];

  isMultiple?: boolean;
}
