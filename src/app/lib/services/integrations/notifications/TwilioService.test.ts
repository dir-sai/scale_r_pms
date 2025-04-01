import { TwilioService } from './TwilioService';
import { NotificationData } from './NotificationService';

describe('TwilioService', () => {
  const config = {
    accountSid: 'AC1b90a4c370163ab1414ab8d67dafc511',
    authToken: '[AuthToken]', // Replace with actual auth token
    messagingServiceSid: 'MG2bcb02bf47218423745e4ce63961d222'
  };

  const service = new TwilioService(config);

  it('should send SMS using messaging service', async () => {
    const notificationData: NotificationData = {
      recipient: {
        phone: '+18777804236'
      },
      template: {
        id: 'test-template',
        type: 'sms',
        content: 'Test message',
        variables: []
      },
      variables: {}
    };

    const result = await service.sendNotification(notificationData);
    expect(result.status).toBe('sent');
    expect(result.channel).toBe('sms');
  });
});