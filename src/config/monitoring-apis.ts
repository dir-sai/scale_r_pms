export const MONITORING_APIS = {
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
  },
  analytics: {
    google: {
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    },
    mixpanel: {
      token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
    }
  },
  logging: {
    logRocket: {
      appId: process.env.NEXT_PUBLIC_LOGROCKET_APP_ID
    }
  }
}