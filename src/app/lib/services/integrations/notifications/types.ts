export interface NotificationTemplate {
  id: string;
  type: 'sms' | 'email';
  content: string;
  variables: string[];
}

export interface NotificationRecipient {
  phone?: string;
  email?: string;
}

export interface NotificationData {
  recipient: NotificationRecipient;
  template: NotificationTemplate;
  variables: Record<string, string>;
}

export interface NotificationResult {
  status: 'sent' | 'failed';
  channel: 'sms' | 'email';
  messageId?: string;
  error?: Error;
}