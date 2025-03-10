import { apiClient } from '../api/client';
import {
  MaintenanceRequest,
  WorkOrder,
  PreventiveMaintenance,
  MaintenanceStats,
  MaintenanceCategory,
  MaintenanceRequestPriority,
} from '../../types/maintenance';

class MaintenanceService {
  private static instance: MaintenanceService;

  private constructor() {}

  static getInstance(): MaintenanceService {
    if (!MaintenanceService.instance) {
      MaintenanceService.instance = new MaintenanceService();
    }
    return MaintenanceService.instance;
  }

  // Maintenance Request Methods
  async createMaintenanceRequest(data: Omit<MaintenanceRequest, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): Promise<MaintenanceRequest> {
    try {
      const response = await apiClient.post('/maintenance/requests', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create maintenance request');
    }
  }

  async updateMaintenanceRequest(requestId: string, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    try {
      const response = await apiClient.put(`/maintenance/requests/${requestId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update maintenance request');
    }
  }

  async getMaintenanceRequest(requestId: string): Promise<MaintenanceRequest> {
    try {
      const response = await apiClient.get(`/maintenance/requests/${requestId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch maintenance request');
    }
  }

  async getMaintenanceRequests(filters?: {
    propertyId?: string;
    unitId?: string;
    tenantId?: string;
    status?: string[];
    category?: MaintenanceCategory[];
    priority?: MaintenanceRequestPriority[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: MaintenanceRequest[]; total: number }> {
    try {
      const response = await apiClient.get('/maintenance/requests', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch maintenance requests');
    }
  }

  async addRequestNote(requestId: string, note: { message: string; attachments?: File[] }): Promise<MaintenanceRequest> {
    try {
      const formData = new FormData();
      formData.append('message', note.message);
      
      if (note.attachments) {
        note.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await apiClient.post(`/maintenance/requests/${requestId}/notes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add note to maintenance request');
    }
  }

  // Work Order Methods
  async createWorkOrder(data: Omit<WorkOrder, 'id' | 'status' | 'completedAt'>): Promise<WorkOrder> {
    try {
      const response = await apiClient.post('/maintenance/work-orders', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create work order');
    }
  }

  async updateWorkOrder(orderId: string, updates: Partial<WorkOrder>): Promise<WorkOrder> {
    try {
      const response = await apiClient.put(`/maintenance/work-orders/${orderId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update work order');
    }
  }

  async getWorkOrder(orderId: string): Promise<WorkOrder> {
    try {
      const response = await apiClient.get(`/maintenance/work-orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch work order');
    }
  }

  async getWorkOrders(filters?: {
    propertyId?: string;
    unitId?: string;
    status?: string[];
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: WorkOrder[]; total: number }> {
    try {
      const response = await apiClient.get('/maintenance/work-orders', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch work orders');
    }
  }

  async addWorkOrderNote(orderId: string, note: { message: string; attachments?: File[] }): Promise<WorkOrder> {
    try {
      const formData = new FormData();
      formData.append('message', note.message);
      
      if (note.attachments) {
        note.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await apiClient.post(`/maintenance/work-orders/${orderId}/notes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add note to work order');
    }
  }

  async completeWorkOrder(orderId: string, data: {
    signature: string;
    completionNotes?: string;
    actualCost?: number;
    laborHours?: number;
    materials?: { item: string; quantity: number; cost: number }[];
  }): Promise<WorkOrder> {
    try {
      const response = await apiClient.post(`/maintenance/work-orders/${orderId}/complete`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete work order');
    }
  }

  // Preventive Maintenance Methods
  async createPreventiveMaintenance(data: Omit<PreventiveMaintenance, 'id'>): Promise<PreventiveMaintenance> {
    try {
      const response = await apiClient.post('/maintenance/preventive', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create preventive maintenance schedule');
    }
  }

  async updatePreventiveMaintenance(scheduleId: string, updates: Partial<PreventiveMaintenance>): Promise<PreventiveMaintenance> {
    try {
      const response = await apiClient.put(`/maintenance/preventive/${scheduleId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update preventive maintenance schedule');
    }
  }

  async getPreventiveMaintenance(scheduleId: string): Promise<PreventiveMaintenance> {
    try {
      const response = await apiClient.get(`/maintenance/preventive/${scheduleId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch preventive maintenance schedule');
    }
  }

  async getPreventiveMaintenanceSchedules(filters?: {
    propertyId?: string;
    category?: MaintenanceCategory[];
    assignedTo?: string;
    active?: boolean;
    upcomingDays?: number;
    page?: number;
    limit?: number;
  }): Promise<{ schedules: PreventiveMaintenance[]; total: number }> {
    try {
      const response = await apiClient.get('/maintenance/preventive', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch preventive maintenance schedules');
    }
  }

  async completePreventiveMaintenance(scheduleId: string, data: {
    cost: number;
    notes?: string;
    attachments?: File[];
    checklist?: { taskId: string; completed: boolean; notes?: string }[];
  }): Promise<PreventiveMaintenance> {
    try {
      const formData = new FormData();
      formData.append('cost', data.cost.toString());
      if (data.notes) formData.append('notes', data.notes);
      if (data.checklist) formData.append('checklist', JSON.stringify(data.checklist));
      
      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await apiClient.post(`/maintenance/preventive/${scheduleId}/complete`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete preventive maintenance');
    }
  }

  // Statistics and Analytics
  async getMaintenanceStats(filters?: {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MaintenanceStats> {
    try {
      const response = await apiClient.get('/maintenance/stats', { params: filters });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch maintenance statistics');
    }
  }
}

export const maintenanceService = MaintenanceService.getInstance(); 