import Script from 'next/script';
import { ExperimentTrackingService } from '@/lib/services/ExperimentTrackingService';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const OPTIMIZE_CONTAINER_ID = 'OPT-XXXXXX'; // Replace with your container ID

const GoogleOptimize = () => {
  const handleOptimizeEvent = (event: any) => {
    if (event.data?.type === 'optimize.activate') {
      ExperimentTrackingService.trackOptimizeExperiment({
        experimentId: event.data.experimentId,
        variantId: event.data.variantId,
        containerId: OPTIMIZE_CONTAINER_ID
      });
    }
  };

  return (
    <>
      <Script
        src={`https://www.googleoptimize.com/optimize.js?id=${OPTIMIZE_CONTAINER_ID}`}
        strategy="afterInteractive"
        onLoad={() => {
          window.addEventListener('message', handleOptimizeEvent);
        }}
      />
      <Script id="optimize-dataLayer" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'optimize_id': '${OPTIMIZE_CONTAINER_ID}'});
        `}
      </Script>
    </>
  );
};

export default GoogleOptimize;