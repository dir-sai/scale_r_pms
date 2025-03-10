import twilio from 'twilio';
import { NotificationService, NotificationData, NotificationResult } from './NotificationService';
import { IntegrationConfig } from '../IntegrationService';

interface TwilioConfig extends IntegrationConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

export class TwilioService extends NotificationService {
  private client: twilio.Twilio;
  private config: TwilioConfig;

  constructor(config: TwilioConfig) {
    super(config);
    this.config = config;
    this.client = twilio(config.accountSid, config.authToken);
  }

  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid Twilio configuration');
    }
  }

  validateConfig(): boolean {
    return !!(this.config.accountSid && this.config.authToken && this.config.fromNumber);
  }

  async sendNotification(data: NotificationData): Promise<NotificationResult> {
    if (data.template.type !== 'sms' || !data.recipient.phone) {
      throw new Error('Invalid SMS notification data');
    }

    return this.handleRequest(
      (async () => {
        const content = this.replaceTemplateVariables(data.template.content, data.variables);
        
        const message = await this.client.messages.create({
          body: content,
          from: this.config.fromNumber,
          to: data.recipient.phone,
        });

        return {
          id: message.sid,
          status: this.mapTwilioStatus(message.status),
          channel: 'sms',
          recipient: data.recipient,
          sentAt: new Date(message.dateCreated),
          error: message.errorMessage,
        };
      })(),
      'Failed to send SMS notification'
    );
  }

  async getNotificationStatus(notificationId: string): Promise<NotificationResult> {
    return this.handleRequest(
      (async () => {
        const message = await this.client.messages(notificationId).fetch();

        return {
          id: message.sid,
          status: this.mapTwilioStatus(message.status),
          channel: 'sms',
          recipient: { phone: message.to },
          sentAt: new Date(message.dateCreated),
          error: message.errorMessage,
        };
      })(),
      'Failed to get SMS notification status'
    );
  }

  private mapTwilioStatus(status: string): NotificationResult['status'] {
    const statusMap: Record<string, NotificationResult['status']> = {
      queued: 'pending',
      sending: 'pending',
      sent: 'sent',
      delivered: 'sent',
      undelivered: 'failed',
      failed: 'failed',
    };
    return statusMap[status] || 'failed';
  }
} 