import LogRocket from 'logrocket';

export class LoggingService {
  static trackEvent(name: string, properties?: Record<string, any>) {
    LogRocket.track(name, properties);
  }

  static trackError(error: Error, context?: Record<string, any>) {
    LogRocket.captureException(error, {
      tags: context,
    });
  }

  static trackPageView(page: string, properties?: Record<string, any>) {
    LogRocket.track('page_view', {
      page,
      ...properties,
    });
  }

  static setUserProperties(properties: Record<string, any>) {
    LogRocket.getSessionURL().then(sessionURL => {
      LogRocket.identify(properties.id, {
        ...properties,
        sessionURL,
      });
    });
  }
}