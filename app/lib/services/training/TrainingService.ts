import { IntegrationService } from '../integrations/IntegrationService';

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'feature' | 'tutorial' | 'faq' | 'guide';
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  content: Array<{
    type: 'text' | 'video' | 'image' | 'quiz';
    title: string;
    data: string;
    duration?: number; // in minutes
  }>;
  prerequisites?: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  progress: number; // 0-100
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  quizScores?: Record<string, number>;
}

export interface SupportArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  tags: string[];
  relatedArticles?: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserFeedback {
  id: string;
  userId: string;
  articleId?: string;
  moduleId?: string;
  rating: number;
  comment?: string;
  helpful: boolean;
  createdAt: Date;
}

export class TrainingService extends IntegrationService {
  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid training service configuration');
    }
  }

  validateConfig(): boolean {
    return true;
  }

  async createModule(data: Omit<TrainingModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<TrainingModule> {
    return this.handleRequest(
      (async () => {
        const module: TrainingModule = {
          id: `module_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return module;
      })(),
      'Failed to create training module'
    );
  }

  async updateUserProgress(data: Omit<UserProgress, 'lastAccessedAt'>): Promise<UserProgress> {
    return this.handleRequest(
      (async () => {
        const progress: UserProgress = {
          ...data,
          lastAccessedAt: new Date(),
        };
        return progress;
      })(),
      'Failed to update user progress'
    );
  }

  async createSupportArticle(data: Omit<SupportArticle, 'id' | 'helpfulCount' | 'notHelpfulCount' | 'createdAt' | 'updatedAt'>): Promise<SupportArticle> {
    return this.handleRequest(
      (async () => {
        const article: SupportArticle = {
          id: `article_${Date.now()}`,
          helpfulCount: 0,
          notHelpfulCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return article;
      })(),
      'Failed to create support article'
    );
  }

  async submitFeedback(data: Omit<UserFeedback, 'id' | 'createdAt'>): Promise<UserFeedback> {
    return this.handleRequest(
      (async () => {
        const feedback: UserFeedback = {
          id: `feedback_${Date.now()}`,
          createdAt: new Date(),
          ...data,
        };

        // Update article helpful counts if applicable
        if (data.articleId) {
          await this.updateArticleHelpfulness(data.articleId, data.helpful);
        }

        return feedback;
      })(),
      'Failed to submit feedback'
    );
  }

  async getRecommendedModules(userId: string): Promise<TrainingModule[]> {
    return this.handleRequest(
      (async () => {
        // Implementation would analyze user progress and recommend modules
        return [];
      })(),
      'Failed to get recommended modules'
    );
  }

  async searchSupportArticles(query: string, language: string): Promise<SupportArticle[]> {
    return this.handleRequest(
      (async () => {
        // Implementation would search articles based on query and language
        return [];
      })(),
      'Failed to search support articles'
    );
  }

  async getUserLearningPath(userId: string): Promise<{
    completedModules: string[];
    inProgressModules: string[];
    recommendedModules: string[];
    overallProgress: number;
  }> {
    return this.handleRequest(
      (async () => {
        return {
          completedModules: [],
          inProgressModules: [],
          recommendedModules: [],
          overallProgress: 0,
        };
      })(),
      'Failed to get user learning path'
    );
  }

  private async updateArticleHelpfulness(articleId: string, helpful: boolean): Promise<void> {
    return this.handleRequest(
      (async () => {
        // Implementation would update article helpfulness counts
      })(),
      'Failed to update article helpfulness'
    );
  }
} 