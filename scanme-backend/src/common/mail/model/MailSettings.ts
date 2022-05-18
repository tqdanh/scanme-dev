export interface MailSettings {
  bcc?: {
    enable?: boolean;
    email?: string;
  };
  bypassListManagement?: {
    enable?: boolean;
  };
  footer?: {
    enable?: boolean;
    text?: string;
    html?: string;
  };
  sandboxMode?: {
    enable?: boolean;
  };
  spamCheck?: {
    enable?: boolean;
    threshold?: number;
    postToUrl?: string;
  };
}
