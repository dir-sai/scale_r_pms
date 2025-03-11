import { api } from '../api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'tenant' | 'manager';
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  phoneNumber?: string;
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

class UserService {
  static async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  }

  static async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  }

  static async updatePreferences(
    userId: string,
    preferences: Partial<User['preferences']>
  ): Promise<User> {
    const response = await api.put(`/users/${userId}/preferences`, preferences);
    return response.data;
  }

  static async uploadProfileImage(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteProfileImage(userId: string): Promise<void> {
    await api.delete(`/users/${userId}/profile-image`);
  }

  static async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    await api.post('/auth/reset-password/confirm', {
      token,
      password: newPassword,
    });
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await api.post(`/users/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}

export { UserService }; 