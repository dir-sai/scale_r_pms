import { ReactNode } from 'react';
import { ExperimentService } from '@/lib/services/ExperimentService';

interface Props {
  experimentId: string;
  variants: Record<string, ReactNode>;
  fallback?: ReactNode;
}

export function ExperimentWrapper({ experimentId, variants, fallback }: Props) {
  const variant = ExperimentService.getAssignedVariant(experimentId);
  
  if (!variant || !variants[variant]) {
    return fallback || null;
  }

  return variants[variant];
}