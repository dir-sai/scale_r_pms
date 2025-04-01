export const API_KEYS = {
  maps: {
    googleMaps: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    geocoding: process.env.GOOGLE_GEOCODING_API_KEY,
  },
  payments: {
    stripe: {
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET,
    },
  },
  finance: {
    quickbooks: {
      clientId: process.env.QUICKBOOKS_CLIENT_ID,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
      redirectUri: process.env.QUICKBOOKS_REDIRECT_URI,
    },
    xero: {
      clientId: process.env.XERO_CLIENT_ID,
      clientSecret: process.env.XERO_CLIENT_SECRET,
      redirectUri: process.env.XERO_REDIRECT_URI,
    },
  },
  communication: {
    sendgrid: process.env.SENDGRID_API_KEY,
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    },
    fcm: process.env.FIREBASE_CLOUD_MESSAGING_KEY,
  },
  storage: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION,
    },
  },
  monitoring: {
    sentry: process.env.NEXT_PUBLIC_SENTRY_DSN,
    googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    logRocket: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID,
  },
  security: {
    recaptcha: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    idVerification: process.env.ID_VERIFICATION_API_KEY,
    kycAml: process.env.KYC_AML_API_KEY,
  },
  externalServices: {
    weather: process.env.WEATHER_API_KEY,
    propertyValuation: process.env.PROPERTY_VALUATION_API_KEY,
    backgroundCheck: process.env.BACKGROUND_CHECK_API_KEY,
  },
};

export const API_ENDPOINTS = {
  maps: {
    geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
    places: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  },
  weather: 'https://api.weatherapi.com/v1',
  propertyValuation: 'https://api.propertydata.com/v1',
  backgroundCheck: 'https://api.backgroundcheck.com/v1',
};
