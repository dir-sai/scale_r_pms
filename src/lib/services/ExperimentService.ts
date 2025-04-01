import LogRocket from 'logrocket';

interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
  targetAudience?: {
    userTypes?: string[];
    locations?: string[];
    deviceTypes?: string[];
  };
}

interface ExperimentAssignment {
  experimentId: string;
  variant: string;
  timestamp: number;
}

export class ExperimentService {
  private static readonly STORAGE_KEY = 'experiment_assignments';
  
  private static experiments: Experiment[] = [
    {
      id: 'new-onboarding-flow',
      name: 'New User Onboarding Flow',
      variants: ['control', 'simplified', 'guided'],
      weights: [0.34, 0.33, 0.33],
    },
    {
      id: 'pricing-display',
      name: 'Pricing Display Format',
      variants: ['monthly', 'annual-focus'],
      targetAudience: {
        userTypes: ['visitor', 'free_trial'],
      },
    },
  ];

  static getAssignedVariant(experimentId: string): string | null {
    // Check stored assignment first
    const stored = this.getStoredAssignments();
    const existing = stored.find(a => a.experimentId === experimentId);
    if (existing) return existing.variant;

    const experiment = this.experiments.find(e => e.id === experimentId);
    if (!experiment) return null;

    // Assign new variant
    const variant = this.assignVariant(experiment);
    if (variant) {
      this.storeAssignment(experimentId, variant);
      this.trackExposure(experimentId, variant);
    }

    return variant;
  }

  private static assignVariant(experiment: Experiment): string | null {
    if (!this.isUserEligible(experiment)) return null;

    const weights = experiment.weights || Array(experiment.variants.length).fill(1 / experiment.variants.length);
    const random = Math.random();
    let sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return experiment.variants[i];
    }

    return experiment.variants[0];
  }

  private static isUserEligible(experiment: Experiment): boolean {
    if (!experiment.targetAudience) return true;

    const { userTypes, locations, deviceTypes } = experiment.targetAudience;
    
    // Add your targeting logic here
    // Example:
    // if (userTypes && !userTypes.includes(currentUserType)) return false;
    // if (locations && !locations.includes(userLocation)) return false;
    // if (deviceTypes && !deviceTypes.includes(deviceType)) return false;

    return true;
  }

  private static getStoredAssignments(): ExperimentAssignment[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static storeAssignment(experimentId: string, variant: string) {
    const assignments = this.getStoredAssignments();
    assignments.push({
      experimentId,
      variant,
      timestamp: Date.now(),
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(assignments));
  }

  private static trackExposure(experimentId: string, variant: string) {
    LogRocket.track('experiment_exposure', {
      experimentId,
      experimentName: this.experiments.find(e => e.id === experimentId)?.name,
      variant,
      timestamp: Date.now(),
    });
  }

  static trackConversion(experimentId: string, conversionType: string, metadata: Record<string, any> = {}) {
    const variant = this.getAssignedVariant(experimentId);
    if (!variant) return;

    LogRocket.track('experiment_conversion', {
      experimentId,
      experimentName: this.experiments.find(e => e.id === experimentId)?.name,
      variant,
      conversionType,
      ...metadata,
      timestamp: Date.now(),
    });
  }
}