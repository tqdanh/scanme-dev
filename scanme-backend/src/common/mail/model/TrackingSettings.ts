export interface TrackingSettings {
  clickTracking?: {
    enable?: boolean;
    enableText?: boolean;
  };
  openTracking?: {
    enable?: boolean;
    substitutionTag?: string;
  };
  subscriptionTracking?: {
    enable?: boolean;
    text?: string;
    html?: string;
    substitutionTag?: string;
  };
  ganalytics?: {
    enable?: boolean;
    utmSource?: string;
    utmMedium?: string;
    utmTerm?: string;
    utmContent?: string;
    utmCampaign?: string;
  };
}
