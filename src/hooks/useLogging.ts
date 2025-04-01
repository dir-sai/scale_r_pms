import LogRocket from 'logrocket';

export function useLogging() {
  const identifyUser = (user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  }) => {
    LogRocket.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
    });
  };

  const logEvent = (name: string, properties?: Record<string, any>) => {
    LogRocket.track(name, properties);
  };

  const logError = (error: Error, properties?: Record<string, any>) => {
    LogRocket.captureException(error, {
      tags: properties,
    });
  };

  return {
    identifyUser,
    logEvent,
    logError,
  };
}