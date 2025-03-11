import { api } from '../api';
import { format } from 'date-fns';

export interface OccupancyData {
  rate: number;
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  trend: Array<{
    date: string;
    rate: number;
  }>;
}

export interface RevenueData {
  total: number;
  recurring: number;
  oneTime: number;
  pending: number;
  trend: Array<{
    date: string;
    amount: number;
    type: 'recurring' | 'oneTime';
  }>;
}

export interface MaintenanceData {
  totalCost: number;
  openRequests: number;
  avgResolutionTime: number;
  costByCategory: Array<{
    category: string;
    cost: number;
    percentage: number;
  }>;
  trend: Array<{
    date: string;
    cost: number;
    requests: number;
  }>;
}

export interface DashboardData {
  occupancy: OccupancyData;
  revenue: RevenueData;
  maintenance: MaintenanceData;
  lastUpdated: string;
}

export interface ReportConfig {
  name: string;
  startDate: string;
  endDate: string;
  metrics: string[];
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  filters?: Record<string, any>;
}

export interface ReportData {
  id: string;
  name: string;
  config: ReportConfig;
  data: any;
  createdAt: string;
  format: 'pdf' | 'csv' | 'excel';
  url: string;
}

export class AnalyticsService {
  static async getDashboardData(tenantId: string): Promise<DashboardData> {
    const response = await api.get(`/tenants/${tenantId}/analytics/dashboard`);
    return response.data;
  }

  static async getOccupancyData(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<OccupancyData> {
    const response = await api.get(`/tenants/${tenantId}/analytics/occupancy`, {
      params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
    });
    return response.data;
  }

  static async getRevenueData(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<RevenueData> {
    const response = await api.get(`/tenants/${tenantId}/analytics/revenue`, {
      params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
    });
    return response.data;
  }

  static async getMaintenanceData(
    tenantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<MaintenanceData> {
    const response = await api.get(`/tenants/${tenantId}/analytics/maintenance`, {
      params: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
    });
    return response.data;
  }

  static async generateReport(
    tenantId: string,
    config: ReportConfig
  ): Promise<ReportData> {
    const response = await api.post(`/tenants/${tenantId}/reports`, config);
    return response.data;
  }

  static async getReportsList(tenantId: string): Promise<ReportData[]> {
    const response = await api.get(`/tenants/${tenantId}/reports`);
    return response.data;
  }

  static async getReport(tenantId: string, reportId: string): Promise<ReportData> {
    const response = await api.get(`/tenants/${tenantId}/reports/${reportId}`);
    return response.data;
  }

  static async deleteReport(tenantId: string, reportId: string): Promise<void> {
    await api.delete(`/tenants/${tenantId}/reports/${reportId}`);
  }

  static async exportReport(
    tenantId: string,
    reportId: string,
    format: 'pdf' | 'csv' | 'excel'
  ): Promise<{ url: string }> {
    const response = await api.post(
      `/tenants/${tenantId}/reports/${reportId}/export`,
      { format }
    );
    return response.data;
  }
} 