export type UserRole = 'admin' | 'property_manager' | 'landlord' | 'tenant' | 'maintenance';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
}

export interface ResetPasswordData {
  email: string;
}

// Role-based permissions
export const ROLE_PERMISSIONS = {
  admin: ['*'], // All permissions
  property_manager: [
    'properties:read',
    'properties:write',
    'leases:read',
    'leases:write',
    'tenants:read',
    'tenants:write',
    'maintenance:read',
    'maintenance:write',
    'payments:read',
    'payments:write',
  ],
  landlord: [
    'properties:read',
    'leases:read',
    'tenants:read',
    'maintenance:read',
    'payments:read',
  ],
  tenant: [
    'leases:read',
    'maintenance:read',
    'maintenance:write',
    'payments:read',
    'payments:write',
  ],
  maintenance: [
    'maintenance:read',
    'maintenance:write',
  ],
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS;

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
} 