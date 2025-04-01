import { useMemo } from 'react';
import { ExperimentService } from '@/lib/services/ExperimentService';

export function useExperiment<T>(
  experimentId: string,
  variants: Record<string, T>,
  fallback: T
): T {
  return useMemo(() => {
    const variant = ExperimentService.getAssignedVariant(experimentId);
    return variant && variants[variant] ? variants[variant] : fallback;
  }, [experimentId, variants, fallback]);
}