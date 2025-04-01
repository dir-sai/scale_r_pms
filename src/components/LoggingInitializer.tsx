import { useEffect } from 'react';
import { initializeLogrocket } from '@/config/logrocket-config';
import { LoggingQuotaService } from '@/lib/services/LoggingQuotaService';

export function LoggingInitializer() {
  useEffect(() => {
    // Initialize LogRocket with privacy settings
    initializeLogrocket();

    // Check quota daily
    const checkQuota = () => {
      LoggingQuotaService.checkQuota();
    };

    checkQuota();
    const quotaInterval = setInterval(checkQuota, 24 * 60 * 60 * 1000);

    return () => {
      clearInterval(quotaInterval);
    };
  }, []);

  return null;
}