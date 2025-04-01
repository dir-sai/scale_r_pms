import LogRocket from 'logrocket';

interface GoogleOptimizeEvent {
  experimentId: string;
  variantId: string;
  containerId: string;
}

export class ExperimentTrackingService {
  private static readonly OPTIMIZE_KEY = 'optimize_assignments';

  static trackOptimizeExperiment(event: GoogleOptimizeEvent) {
    // Store experiment assignment
    this.storeOptimizeAssignment(event);

    // Track in LogRocket
    LogRocket.track('optimize_experiment_exposure', {
      experimentId: event.experimentId,
      variantId: event.variantId,
      containerId: event.containerId,
      timestamp: Date.now()
    });
  }

  static trackConversion(event: GoogleOptimizeEvent, conversionData: Record<string, any>) {
    LogRocket.track('optimize_experiment_conversion', {
      experimentId: event.experimentId,
      variantId: event.variantId,
      containerId: event.containerId,
      ...conversionData,
      timestamp: Date.now()
    });
  }

  private static storeOptimizeAssignment(event: GoogleOptimizeEvent) {
    try {
      const stored = localStorage.getItem(this.OPTIMIZE_KEY);
      const assignments = stored ? JSON.parse(stored) : {};
      
      assignments[event.experimentId] = {
        variantId: event.variantId,
        containerId: event.containerId,
        timestamp: Date.now()
      };

      localStorage.setItem(this.OPTIMIZE_KEY, JSON.stringify(assignments));
    } catch (error) {
      console.error('Failed to store Optimize assignment:', error);
    }
  }
}