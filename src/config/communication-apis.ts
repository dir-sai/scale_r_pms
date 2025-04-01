export const COMMUNICATION_APIS = {
  email: {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.SENDGRID_FROM_EMAIL
    }
  },
  sms: {
    hubtel: {
      clientId: process.env.HUBTEL_SMS_CLIENT_ID,
      clientSecret: process.env.HUBTEL_SMS_CLIENT_SECRET,
      senderId: process.env.HUBTEL_SMS_SENDER_ID
    },
    mnotify: {
      apiKey: process.env.MNOTIFY_API_KEY,
      senderId: process.env.MNOTIFY_SENDER_ID
    }
  },
  push: {
    fcm: {
      serverKey: process.env.FIREBASE_SERVER_KEY,
      vapidKey: process.env.FIREBASE_VAPID_KEY
    }
  }
}