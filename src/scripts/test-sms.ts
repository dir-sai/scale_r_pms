import { TwilioService } from '../app/lib/services/integrations/notifications/TwilioService';

async function testSMS() {
  const service = new TwilioService({
    accountSid: 'AC1b90a4c370163ab1414ab8d67dafc511',
    authToken: '[AuthToken]', // Replace with your actual auth token
    messagingServiceSid: 'MG2bcb02bf47218423745e4ce63961d222'
  });

  try {
    const result = await service.sendNotification({
      recipient: {
        phone: '+18777804236'
      },
      template: {
        id: 'test',
        type: 'sms',
        content: 'Test message from Twilio',
        variables: []
      },
      variables: {}
    });

    console.log('SMS sent successfully:', result);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
}

testSMS();