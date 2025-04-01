import LogRocket from 'logrocket';
import { MONITORING_APIS } from '@/config/monitoring-apis';

export class DelightedService {
  private static async getLogRocketSession(): Promise<string> {
    return new Promise((resolve) => {
      LogRocket.getSessionURL(sessionURL => resolve(sessionURL));
    });
  }

  static async submitNPSScore(score: number, feedback: string, touchpoint: string) {
    const sessionURL = await DelightedService.getLogRocketSession();

    // Send to Delighted API
    const response = await fetch('https://api.delighted.com/v1/people', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(process.env.DELIGHTED_API_KEY || '')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        score,
        comment: feedback,
        properties: {
          touchpoint,
          logrocket_session: sessionURL,
          environment: process.env.NODE_ENV,
          app_version: process.env.NEXT_PUBLIC_APP_VERSION,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit NPS to Delighted');
    }

    // Track NPS event in LogRocket
    LogRocket.track('nps_submitted', {
      score,
      touchpoint,
      sessionURL,
      platform: 'delighted',
    });

    return response.json();
  }
}