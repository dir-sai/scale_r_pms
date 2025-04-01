import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';
import { MONITORING_APIS } from './monitoring-apis';

export const initializeSentry = () => {
  Sentry.init({
    dsn: MONITORING_APIS.sentry.dsn,
    enabled: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    attachStacktrace: true,
    // Integrate with LogRocket for better debugging
    beforeSend: (event) => {
      if (Platform.OS === 'web') {
        // Add LogRocket session URL to Sentry error
        LogRocket.getSessionURL(sessionURL => {
          Sentry.configureScope(scope => {
            scope.setExtra('logRocketSession', sessionURL);
          });
        });
      }
      return event;
    }
  });
};