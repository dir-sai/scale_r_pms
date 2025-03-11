import { apiClient } from '../apiClient';
import { CommunicationLog } from '../../types/tenant';

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
  variables: string[];
}

interface SendMessageOptions {
  recipients: string[];
  subject: string;
  content: string;
  type: 'email' | 'sms' | 'in_app';
  templateId?: string;
  variables?: Record<string, string>;
  attachments?: {
    name: string;
    content: string;
    type: string;
  }[];
  scheduledFor?: Date;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

class MessagingService {
  private static instance: MessagingService;

  private constructor() {}

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  // Bulk Messaging Methods
  async sendBulkMessage(options: SendMessageOptions): Promise<CommunicationLog[]> {
    try {
      const response = await apiClient.post('/messages/bulk', options);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send bulk message');
    }
  }

  async getMessageTemplates(): Promise<MessageTemplate[]> {
    try {
      const response = await apiClient.get('/messages/templates');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch message templates');
    }
  }

  async createMessageTemplate(template: Omit<MessageTemplate, 'id'>): Promise<MessageTemplate> {
    try {
      const response = await apiClient.post('/messages/templates', template);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create message template');
    }
  }

  // Chat Methods
  async getChatMessages(userId: string, page: number = 1, limit: number = 20): Promise<{
    messages: ChatMessage[];
    total: number;
  }> {
    try {
      const response = await apiClient.get(`/chat/messages/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chat messages');
    }
  }

  async sendChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): Promise<ChatMessage> {
    try {
      const response = await apiClient.post('/chat/messages', message);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send chat message');
    }
  }

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      await apiClient.post('/chat/messages/read', { messageIds });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark messages as read');
    }
  }

  // Notification Methods
  async sendNotification(
    userId: string,
    type: 'lease_expiry' | 'rent_due' | 'maintenance' | 'custom',
    data: {
      title: string;
      message: string;
      priority?: 'low' | 'medium' | 'high';
      action?: {
        type: string;
        payload: any;
      };
    }
  ): Promise<void> {
    try {
      await apiClient.post(`/notifications/${userId}`, {
        type,
        ...data,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send notification');
    }
  }

  async scheduleReminder(
    userId: string,
    type: 'rent' | 'lease_expiry' | 'inspection' | 'custom',
    data: {
      title: string;
      message: string;
      scheduledFor: Date;
      recurrence?: {
        frequency: 'daily' | 'weekly' | 'monthly';
        endDate?: Date;
      };
    }
  ): Promise<void> {
    try {
      await apiClient.post(`/reminders/${userId}`, {
        type,
        ...data,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to schedule reminder');
    }
  }

  // Message History Methods
  async getCommunicationHistory(
    userId: string,
    filters?: {
      type?: CommunicationLog['type'][];
      startDate?: Date;
      endDate?: Date;
      status?: CommunicationLog['status'][];
    },
    page: number = 1,
    limit: number = 20
  ): Promise<{
    logs: CommunicationLog[];
    total: number;
  }> {
    try {
      const response = await apiClient.get(`/communications/${userId}`, {
        params: {
          ...filters,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch communication history');
    }
  }
}

export const messagingService = MessagingService.getInstance(); 