import { LoggingService } from './LoggingService';

export type NPSScore = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface NPSFeedback {
  score: NPSScore;
  feedback?: string;
  userId: string;
  userType: 'tenant' | 'landlord' | 'agent';
  touchpoint: string;
}

export interface VoCFeedback {
  category: 'bug' | 'feature' | 'experience' | 'support' | 'other';
  sentiment: 'positive' | 'neutral' | 'negative';
  feedback: string;
  userId: string;
  userType: 'tenant' | 'landlord' | 'agent';
  context?: Record<string, any>;
}

export class FeedbackService {
  static async submitNPS(data: NPSFeedback) {
    try {
      const response = await fetch('/api/feedback/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit NPS');

      LoggingService.trackEvent('nps_submitted', {
        score: data.score,
        touchpoint: data.touchpoint,
        userType: data.userType,
      });

      return response.json();
    } catch (error) {
      LoggingService.trackError(error as Error, { context: 'NPS_submission' });
      throw error;
    }
  }

  static async submitVoC(data: VoCFeedback) {
    try {
      const response = await fetch('/api/feedback/voc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit VoC');

      LoggingService.trackEvent('voc_submitted', {
        category: data.category,
        sentiment: data.sentiment,
        userType: data.userType,
      });

      return response.json();
    } catch (error) {
      LoggingService.trackError(error as Error, { context: 'VoC_submission' });
      throw error;
    }
  }
}