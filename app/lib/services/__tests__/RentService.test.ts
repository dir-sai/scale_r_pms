import { RentService } from '../RentService';
import { RentCalculationParams, RentType } from '../../../types/rent';

describe('RentService', () => {
  let rentService: RentService;

  beforeEach(() => {
    rentService = new RentService();
  });

  describe('calculateRent', () => {
    it('should calculate monthly rent correctly', () => {
      const params: RentCalculationParams = {
        baseAmount: 1000,
        rentType: RentType.MONTHLY,
        utilities: {
          water: 50,
          electricity: 100,
          internet: 80,
        },
        maintenanceFee: 100,
        securityDeposit: 2000,
        isFirstMonth: true,
      };

      const result = rentService.calculateRent(params);

      expect(result.totalAmount).toBe(3330); // Base + Utilities + Maintenance + Deposit
      expect(result.breakdown).toEqual({
        baseRent: 1000,
        utilities: 230,
        maintenanceFee: 100,
        securityDeposit: 2000,
      });
    });

    it('should calculate yearly rent with discount correctly', () => {
      const params: RentCalculationParams = {
        baseAmount: 1000 * 12, // Monthly rent * 12
        rentType: RentType.YEARLY,
        utilities: {
          water: 50 * 12,
          electricity: 100 * 12,
          internet: 80 * 12,
        },
        maintenanceFee: 100 * 12,
        yearlyDiscount: 0.1, // 10% discount
        isFirstYear: true,
        securityDeposit: 2000,
      };

      const result = rentService.calculateRent(params);

      const expectedBaseRent = 12000 * 0.9; // After 10% discount
      const expectedUtilities = (50 + 100 + 80) * 12;
      const expectedMaintenance = 100 * 12;

      expect(result.totalAmount).toBe(expectedBaseRent + expectedUtilities + expectedMaintenance + 2000);
      expect(result.breakdown).toEqual({
        baseRent: expectedBaseRent,
        utilities: expectedUtilities,
        maintenanceFee: expectedMaintenance,
        securityDeposit: 2000,
      });
    });

    it('should handle pro-rated rent calculation', () => {
      const params: RentCalculationParams = {
        baseAmount: 1000,
        rentType: RentType.MONTHLY,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-31'),
        utilities: {
          water: 50,
          electricity: 100,
          internet: 80,
        },
        maintenanceFee: 100,
        isFirstMonth: true,
      };

      const result = rentService.calculateRent(params);

      // 17 days out of 31 days
      const proRatedFactor = 17 / 31;
      const expectedBaseRent = Math.round(1000 * proRatedFactor);
      const expectedUtilities = Math.round((50 + 100 + 80) * proRatedFactor);
      const expectedMaintenance = Math.round(100 * proRatedFactor);

      expect(result.totalAmount).toBe(expectedBaseRent + expectedUtilities + expectedMaintenance);
      expect(result.breakdown).toEqual({
        baseRent: expectedBaseRent,
        utilities: expectedUtilities,
        maintenanceFee: expectedMaintenance,
        securityDeposit: 0,
      });
    });

    it('should throw error for invalid date range', () => {
      const params: RentCalculationParams = {
        baseAmount: 1000,
        rentType: RentType.MONTHLY,
        startDate: new Date('2024-01-31'),
        endDate: new Date('2024-01-15'), // End date before start date
        utilities: {
          water: 50,
          electricity: 100,
          internet: 80,
        },
        maintenanceFee: 100,
      };

      expect(() => rentService.calculateRent(params)).toThrow('Invalid date range');
    });

    it('should handle zero utilities and maintenance', () => {
      const params: RentCalculationParams = {
        baseAmount: 1000,
        rentType: RentType.MONTHLY,
        utilities: {},
        maintenanceFee: 0,
      };

      const result = rentService.calculateRent(params);

      expect(result.totalAmount).toBe(1000);
      expect(result.breakdown).toEqual({
        baseRent: 1000,
        utilities: 0,
        maintenanceFee: 0,
        securityDeposit: 0,
      });
    });
  });
}); 