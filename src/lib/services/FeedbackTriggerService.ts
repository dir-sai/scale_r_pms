export class FeedbackTriggerService {
  private static readonly FEEDBACK_COOLDOWN = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly KEY_PREFIX = '@feedback_last_shown_';

  static async shouldShowNPS(userId: string, touchpoint: string): Promise<boolean> {
    const key = `${this.KEY_PREFIX}nps_${touchpoint}_${userId}`;
    const lastShown = await AsyncStorage.getItem(key);
    
    if (!lastShown) return true;
    
    const timeSinceLastShown = Date.now() - parseInt(lastShown, 10);
    return timeSinceLastShown > this.FEEDBACK_COOLDOWN;
  }

  static async markNPSShown(userId: string, touchpoint: string): Promise<void> {
    const key = `${this.KEY_PREFIX}nps_${touchpoint}_${userId}`;
    await AsyncStorage.setItem(key, Date.now().toString());
  }

  static async shouldShowVoC(userId: string): Promise<boolean> {
    const key = `${this.KEY_PREFIX}voc_${userId}`;
    const lastShown = await AsyncStorage.getItem(key);
    
    if (!lastShown) return true;
    
    const timeSinceLastShown = Date.now() - parseInt(lastShown, 10);
    return timeSinceLastShown > this.FEEDBACK_COOLDOWN;
  }

  static async markVoCShown(userId: string): Promise<void> {
    const key = `${this.KEY_PREFIX}voc_${userId}`;
    await AsyncStorage.setItem(key, Date.now().toString());
  }
}