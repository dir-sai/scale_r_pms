import { ExperimentWrapper } from './ExperimentWrapper';
import { MonthlyPricing } from './pricing/MonthlyPricing';
import { AnnualPricing } from './pricing/AnnualPricing';

export function PricingDisplay() {
  const handlePurchase = (plan: string) => {
    ExperimentService.trackConversion('pricing-display', 'purchase', {
      plan,
      amount: 99.99,
    });
    // Handle purchase...
  };

  return (
    <ExperimentWrapper
      experimentId="pricing-display"
      variants={{
        'monthly': <MonthlyPricing onPurchase={handlePurchase} />,
        'annual-focus': <AnnualPricing onPurchase={handlePurchase} />,
      }}
      fallback={<MonthlyPricing onPurchase={handlePurchase} />}
    />
  );
}