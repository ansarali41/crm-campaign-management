export interface AnalyticsOverview {
  total_campaigns: number;
  total_emails_sent: number;
  total_sms_sent: number;
  total_delivered: number;
}

export interface EmailMessage {
  to: string[];
  subject: string;
  html: string;
  campaignId: string;
  campaign: any;
}

export interface SendEmailParams {
  to: string[];
  subject: string;
  html: string;
  campaignId: string;
  campaign: any;
}
