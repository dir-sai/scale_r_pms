import { IntegrationService, IntegrationConfig } from '../IntegrationService';

export interface NotificationRecipient {
  email?: string;
  phone?: string;
  name?: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

export interface NotificationData {
  recipient: NotificationRecipient;
  template: NotificationTemplate;
  variables: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

export interface NotificationResult {
  id: string;
  status: 'sent' | 'failed' | 'pending';
  channel: 'email' | 'sms';
  recipient: NotificationRecipient;
  sentAt: Date;
  error?: string;
}

export abstract class NotificationService extends IntegrationService {
  abstract sendNotification(data: NotificationData): Promise<NotificationResult>;
  abstract getNotificationStatus(notificationId: string): Promise<NotificationResult>;
  
  protected replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match);
  }
} 