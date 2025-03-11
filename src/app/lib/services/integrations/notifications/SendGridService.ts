import sgMail from '@sendgrid/mail';
import { NotificationService, NotificationData, NotificationResult } from './NotificationService';
import { IntegrationConfig } from '../IntegrationService';

interface SendGridConfig extends IntegrationConfig {
  fromEmail: string;
  fromName?: string;
}

export class SendGridService extends NotificationService {
  protected config: SendGridConfig;

  constructor(config: SendGridConfig) {
    super(config);
    this.config = config;
    sgMail.setApiKey(config.apiKey);
  }

  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid SendGrid configuration');
    }
  }

  validateConfig(): boolean {
    return !!(this.config.apiKey && this.config.fromEmail);
  }

  async sendNotification(data: NotificationData): Promise<NotificationResult> {
    if (data.template.type !== 'email' || !data.recipient.email) {
      throw new Error('Invalid email notification data');
    }

    return this.handleRequest(
      (async () => {
        const content = this.replaceTemplateVariables(data.template.content, data.variables);
        const subject = data.template.subject 
          ? this.replaceTemplateVariables(data.template.subject, data.variables)
          : 'Notification';

        const msg = {
          to: data.recipient.email,
          from: {
            email: this.config.fromEmail,
            name: this.config.fromName,
          },
          subject,
          html: content,
          ...(data.attachments && {
            attachments: data.attachments.map(attachment => ({
              filename: attachment.filename,
              content: Buffer.isBuffer(attachment.content)
                ? attachment.content.toString('base64')
                : Buffer.from(attachment.content).toString('base64'),
              type: attachment.contentType,
              disposition: 'attachment',
            })),
          }),
        };

        const response = await sgMail.send(msg);
        const [firstResponse] = response;

        return {
          id: firstResponse.headers['x-message-id'],
          status: this.mapSendGridStatus(firstResponse.statusCode),
          channel: 'email',
          recipient: data.recipient,
          sentAt: new Date(),
        };
      })(),
      'Failed to send email notification'
    );
  }

  async getNotificationStatus(notificationId: string): Promise<NotificationResult> {
    // SendGrid doesn't provide a direct way to check message status
    // You would need to use their Event Webhook for real-time status updates
    throw new Error('SendGrid message status checking not implemented');
  }

  private mapSendGridStatus(statusCode: number): NotificationResult['status'] {
    return statusCode >= 200 && statusCode < 300 ? 'sent' : 'failed';
  }
} 