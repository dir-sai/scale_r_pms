import LogRocket from '@logrocket/react-native';
import { MONITORING_APIS } from './monitoring-apis';

export const initializeLogRocketNative = () => {
  if (MONITORING_APIS.logging.logRocket.appId) {
    LogRocket.init(MONITORING_APIS.logging.logRocket.appId, {
      release: process.env.EXPO_PUBLIC_APP_VERSION,
      network: {
        isEnabled: true,
        requestSanitizer: (request) => {
          // Redact sensitive data from requests
          if (request.headers) {
            request.headers = {
              ...request.headers,
              Authorization: '[REDACTED]',
            };
          }
          return request;
        },
        responseSanitizer: (response) => {
          // Redact sensitive data from responses
          if (response.body) {
            // Remove sensitive patterns
            response.body = JSON.stringify(response.body)
              .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
              .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD REDACTED]');
          }
          return response;
        },
      },
      console: {
        isEnabled: true,
        shouldAggregateConsoleErrors: true,
      },
    });
  }
};