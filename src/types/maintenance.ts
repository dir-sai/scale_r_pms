export type MaintenanceRequestStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type MaintenanceRequestPriority = 'low' | 'medium' | 'high' | 'emergency';

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'structural'
  | 'pest_control'
  | 'cleaning'
  | 'painting'
  | 'security'
  | 'other';

export type WorkOrderStatus =
  | 'pending_assignment'
  | 'assigned'
  | 'scheduled'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  unitId: string;
  tenantId: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  priority: MaintenanceRequestPriority;
  status: MaintenanceRequestStatus;
  submittedAt: string;
  updatedAt: string;
  scheduledDate?: string;
  completedAt?: string;
  attachments?: {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnailUrl?: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  }[];
  notes?: {
    id: string;
    userId: string;
    userType: 'tenant' | 'staff' | 'vendor';
    message: string;
    createdAt: string;
    attachments?: {
      id: string;
      type: 'image' | 'video' | 'document';
      url: string;
    }[];
  }[];
}

export interface WorkOrder {
  id: string;
  requestId: string;
  propertyId: string;
  unitId: string;
  status: WorkOrderStatus;
  assignedTo: {
    id: string;
    type: 'staff' | 'vendor';
    name: string;
    contact: {
      phone?: string;
      email?: string;
    };
  };
  estimatedCost?: number;
  actualCost?: number;
  materials?: {
    item: string;
    quantity: number;
    cost: number;
  }[];
  laborHours?: number;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: {
    id: string;
    userId: string;
    userType: 'staff' | 'vendor';
    message: string;
    createdAt: string;
    attachments?: {
      id: string;
      type: 'image' | 'video' | 'document';
      url: string;
    }[];
  }[];
  signature?: {
    signedBy: string;
    signedAt: string;
    signatureUrl: string;
  };
  rating?: {
    score: number;
    comment?: string;
    createdAt: string;
  };
}

export interface PreventiveMaintenance {
  id: string;
  propertyId: string;
  category: MaintenanceCategory;
  title: string;
  description: string;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number; // e.g., every 2 weeks
    daysOfWeek?: number[]; // 0-6, where 0 is Sunday
    dayOfMonth?: number; // 1-31
    monthsOfYear?: number[]; // 1-12
  };
  assignedTo: {
    id: string;
    type: 'staff' | 'vendor';
    name: string;
  };
  estimatedDuration: number; // in hours
  estimatedCost: number;
  checklist?: {
    id: string;
    task: string;
    required: boolean;
  }[];
  nextDueDate: string;
  lastCompletedAt?: string;
  active: boolean;
  notifications: {
    type: 'email' | 'sms' | 'push';
    recipients: string[];
    advanceNotice: number; // in days
  }[];
  history: {
    id: string;
    completedAt: string;
    completedBy: {
      id: string;
      name: string;
    };
    cost: number;
    notes?: string;
    attachments?: {
      id: string;
      type: 'image' | 'video' | 'document';
      url: string;
    }[];
    checklist?: {
      taskId: string;
      completed: boolean;
      notes?: string;
    }[];
  }[];
}

export interface MaintenanceStats {
  totalRequests: number;
  openRequests: number;
  completedRequests: number;
  averageResolutionTime: number; // in hours
  requestsByCategory: {
    category: MaintenanceCategory;
    count: number;
  }[];
  requestsByPriority: {
    priority: MaintenanceRequestPriority;
    count: number;
  }[];
  upcomingPreventiveMaintenance: {
    id: string;
    title: string;
    dueDate: string;
    category: MaintenanceCategory;
  }[];
  costByCategory: {
    category: MaintenanceCategory;
    totalCost: number;
  }[];
  vendorPerformance: {
    vendorId: string;
    vendorName: string;
    completedOrders: number;
    averageRating: number;
    averageResolutionTime: number;
  }[];
} 