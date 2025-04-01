import LogRocket from 'logrocket';
import { MONITORING_APIS } from './monitoring-apis';

export const initializeLogging = () => {
  if (typeof window !== 'undefined' && MONITORING_APIS.logging.logRocket.appId) {
    LogRocket.init(MONITORING_APIS.logging.logRocket.appId);
    
    // Identify users when they log in
    LogRocket.identify('fp74pp/scale-r', {
      name: 'Scale-R PMS',
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    });

    // Add LogRocket to error tracking
    window.onerror = (message, source, lineno, colno, error) => {
      LogRocket.captureException(error);
    };
  }
};