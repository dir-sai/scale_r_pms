import { IntegrationService } from '../integrations/IntegrationService';

export type UtilityType = 'electricity' | 'water' | 'gas' | 'internet' | 'waste' | 'other';

export interface UtilityReading {
  id: string;
  propertyId: string;
  unitId: string;
  utilityType: UtilityType;
  readingDate: Date;
  reading: number;
  unit: string;
  meterNumber?: string;
  photo?: string;
  notes?: string;
  readBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UtilityBill {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  utilityType: UtilityType;
  period: {
    startDate: Date;
    endDate: Date;
  };
  readings: {
    previous: UtilityReading;
    current: UtilityReading;
  };
  consumption: number;
  rate: number;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'disputed';
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UtilityRate {
  id: string;
  propertyId: string;
  utilityType: UtilityType;
  rate: number;
  currency: string;
  unit: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  tieredRates?: Array<{
    threshold: number;
    rate: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export class UtilitiesService extends IntegrationService {
  async initialize(): Promise<void> {
    if (!this.validateConfig()) {
      throw new Error('Invalid utilities service configuration');
    }
  }

  validateConfig(): boolean {
    return true;
  }

  async recordReading(data: Omit<UtilityReading, 'id' | 'createdAt' | 'updatedAt'>): Promise<UtilityReading> {
    return this.handleRequest(
      (async () => {
        const reading: UtilityReading = {
          id: `reading_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return reading;
      })(),
      'Failed to record utility reading'
    );
  }

  async generateBill(data: Omit<UtilityBill, 'id' | 'consumption' | 'amount' | 'createdAt' | 'updatedAt'>): Promise<UtilityBill> {
    return this.handleRequest(
      (async () => {
        // Calculate consumption
        const consumption = data.readings.current.reading - data.readings.previous.reading;
        
        // Get applicable rate
        const rate = await this.getApplicableRate(data.propertyId, data.utilityType, data.period.startDate);
        
        // Calculate amount
        const amount = this.calculateAmount(consumption, rate);

        const bill: UtilityBill = {
          id: `bill_${Date.now()}`,
          consumption,
          amount,
          rate: rate.rate,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return bill;
      })(),
      'Failed to generate utility bill'
    );
  }

  async updateBillStatus(id: string, status: UtilityBill['status'], paidAt?: Date): Promise<UtilityBill> {
    return this.handleRequest(
      (async () => {
        const bill: UtilityBill = {
          id,
          status,
          paidAt,
          updatedAt: new Date(),
        } as UtilityBill;
        return bill;
      })(),
      'Failed to update bill status'
    );
  }

  async setUtilityRate(data: Omit<UtilityRate, 'id' | 'createdAt' | 'updatedAt'>): Promise<UtilityRate> {
    return this.handleRequest(
      (async () => {
        const rate: UtilityRate = {
          id: `rate_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data,
        };
        return rate;
      })(),
      'Failed to set utility rate'
    );
  }

  private async getApplicableRate(propertyId: string, utilityType: UtilityType, date: Date): Promise<UtilityRate> {
    return this.handleRequest(
      (async () => {
        // Implementation would query the database for applicable rate
        throw new Error('Rate not found');
      })(),
      'Failed to get applicable rate'
    );
  }

  private calculateAmount(consumption: number, rate: UtilityRate): number {
    if (!rate.tieredRates) {
      return consumption * rate.rate;
    }

    // Calculate amount using tiered rates
    let remainingConsumption = consumption;
    let totalAmount = 0;
    const sortedTiers = [...rate.tieredRates].sort((a, b) => a.threshold - b.threshold);

    for (let i = 0; i < sortedTiers.length; i++) {
      const currentTier = sortedTiers[i];
      const nextTier = sortedTiers[i + 1];
      const tierConsumption = nextTier
        ? Math.min(remainingConsumption, nextTier.threshold - currentTier.threshold)
        : remainingConsumption;

      totalAmount += tierConsumption * currentTier.rate;
      remainingConsumption -= tierConsumption;

      if (remainingConsumption <= 0) break;
    }

    return totalAmount;
  }

  async getUtilityUsageReport(
    propertyId: string,
    utilityType: UtilityType,
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalConsumption: number;
    totalAmount: number;
    averageDaily: number;
    readings: UtilityReading[];
    bills: UtilityBill[];
  }> {
    return this.handleRequest(
      (async () => {
        return {
          totalConsumption: 0,
          totalAmount: 0,
          averageDaily: 0,
          readings: [],
          bills: [],
        };
      })(),
      'Failed to generate utility usage report'
    );
  }
} 