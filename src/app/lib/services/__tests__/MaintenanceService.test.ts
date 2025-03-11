import { MaintenanceService } from '../MaintenanceService';
import { MaintenanceRequest, MaintenanceStatus, Priority } from '../../../types/maintenance';

describe('MaintenanceService', () => {
  let maintenanceService: MaintenanceService;

  beforeEach(() => {
    maintenanceService = new MaintenanceService();
  });

  describe('createMaintenanceRequest', () => {
    it('should create a maintenance request with correct priority', () => {
      const request: Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'> = {
        propertyId: 'prop123',
        tenantId: 'tenant456',
        description: 'Water leak in bathroom',
        category: 'plumbing',
        priority: Priority.HIGH,
        images: ['leak1.jpg', 'leak2.jpg'],
      };

      const result = maintenanceService.createMaintenanceRequest(request);

      expect(result).toMatchObject({
        ...request,
        status: MaintenanceStatus.PENDING,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should validate required fields', () => {
      const invalidRequest = {
        propertyId: 'prop123',
        // Missing tenantId
        description: 'Water leak',
        category: 'plumbing',
        priority: Priority.HIGH,
      };

      expect(() => maintenanceService.createMaintenanceRequest(invalidRequest as any))
        .toThrow('Missing required fields');
    });
  });

  describe('updateMaintenanceStatus', () => {
    it('should update maintenance request status with valid transition', () => {
      const request: MaintenanceRequest = {
        id: 'maint123',
        propertyId: 'prop123',
        tenantId: 'tenant456',
        description: 'Water leak in bathroom',
        category: 'plumbing',
        priority: Priority.HIGH,
        status: MaintenanceStatus.PENDING,
        images: ['leak1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = maintenanceService.updateMaintenanceStatus(
        request,
        MaintenanceStatus.IN_PROGRESS,
        'Assigned to plumber'
      );

      expect(result).toMatchObject({
        ...request,
        status: MaintenanceStatus.IN_PROGRESS,
        statusHistory: expect.arrayContaining([
          expect.objectContaining({
            from: MaintenanceStatus.PENDING,
            to: MaintenanceStatus.IN_PROGRESS,
            note: 'Assigned to plumber',
            timestamp: expect.any(Date),
          }),
        ]),
      });
    });

    it('should prevent invalid status transitions', () => {
      const request: MaintenanceRequest = {
        id: 'maint123',
        propertyId: 'prop123',
        tenantId: 'tenant456',
        description: 'Water leak in bathroom',
        category: 'plumbing',
        priority: Priority.HIGH,
        status: MaintenanceStatus.COMPLETED,
        images: ['leak1.jpg'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(() =>
        maintenanceService.updateMaintenanceStatus(
          request,
          MaintenanceStatus.PENDING,
          'Invalid transition'
        )
      ).toThrow('Invalid status transition');
    });
  });

  describe('calculateMaintenancePriority', () => {
    it('should calculate HIGH priority for emergency issues', () => {
      const priority = maintenanceService.calculateMaintenancePriority({
        category: 'plumbing',
        description: 'Major water leak flooding the apartment',
        isEmergency: true,
      });

      expect(priority).toBe(Priority.HIGH);
    });

    it('should calculate MEDIUM priority for standard repairs', () => {
      const priority = maintenanceService.calculateMaintenancePriority({
        category: 'appliances',
        description: 'Dishwasher not draining properly',
        isEmergency: false,
      });

      expect(priority).toBe(Priority.MEDIUM);
    });

    it('should calculate LOW priority for cosmetic issues', () => {
      const priority = maintenanceService.calculateMaintenancePriority({
        category: 'painting',
        description: 'Touch up paint needed in bedroom',
        isEmergency: false,
      });

      expect(priority).toBe(Priority.LOW);
    });
  });

  describe('estimateCompletionTime', () => {
    it('should estimate completion time based on priority and category', () => {
      const highPriorityEstimate = maintenanceService.estimateCompletionTime({
        category: 'plumbing',
        priority: Priority.HIGH,
      });

      expect(highPriorityEstimate).toBeLessThanOrEqual(24); // 24 hours for high priority

      const mediumPriorityEstimate = maintenanceService.estimateCompletionTime({
        category: 'appliances',
        priority: Priority.MEDIUM,
      });

      expect(mediumPriorityEstimate).toBeLessThanOrEqual(72); // 72 hours for medium priority

      const lowPriorityEstimate = maintenanceService.estimateCompletionTime({
        category: 'painting',
        priority: Priority.LOW,
      });

      expect(lowPriorityEstimate).toBeLessThanOrEqual(168); // 168 hours (1 week) for low priority
    });
  });
}); 