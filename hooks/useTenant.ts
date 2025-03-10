import { useContext } from 'react';
import { TenantContext } from '../app/context/TenantContext';

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
} 