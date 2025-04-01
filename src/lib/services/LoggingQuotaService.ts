import LogRocket from 'logrocket';

export class LoggingQuotaService {
  private static readonly QUOTA_THRESHOLD = 0.8; // 80% of quota
  private static readonly MONTHLY_QUOTA = 1000000; // Adjust based on your plan
  private static currentUsage = 0;

  static async checkQuota(): Promise<void> {
    try {
      const response = await fetch('/api/logging/quota');
      const { usage } = await response.json();
      
      this.currentUsage = usage;
      
      if (this.isApproachingQuota()) {
        this.notifyQuotaWarning();
      }
    } catch (error) {
      console.error('Failed to check logging quota:', error);
    }
  }

  private static isApproachingQuota(): boolean {
    return this.currentUsage >= (this.MONTHLY_QUOTA * this.QUOTA_THRESHOLD);
  }

  private static notifyQuotaWarning(): void {
    // Send notification to admin
    fetch('/api/notifications/admin', {
      method: 'POST',
      body: JSON.stringify({
        type: 'LOGGING_QUOTA_WARNING',
        usage: this.currentUsage,
        quota: this.MONTHLY_QUOTA,
      }),
    });
  }
}