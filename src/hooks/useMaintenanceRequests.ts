import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type MaintenanceRequest = Database['public']['Tables']['maintenance_requests']['Row'];

/**
 * Hook for managing maintenance requests with caching and optimistic updates
 * @returns An object containing maintenance requests data and methods
 * @example
 * ```tsx
 * const { requests, loading, error, createRequest, updateRequest } = useMaintenanceRequests();
 * ```
 */
export function useMaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const fetchRequests = useCallback(async (force = false) => {
    // Return cached data if within cache duration
    if (!force && Date.now() - lastFetch < CACHE_DURATION) {
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setRequests(data || []);
      setLastFetch(Date.now());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [lastFetch]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /**
   * Creates a new maintenance request with optimistic update
   * @param request - The request data to create
   * @returns Object containing the created data or error
   */
  const createRequest = async (
    request: Database['public']['Tables']['maintenance_requests']['Insert']
  ) => {
    // Create optimistic temporary ID
    const tempId = `temp_${Date.now()}`;
    const optimisticRequest = {
      ...request,
      id: tempId,
      created_at: new Date().toISOString(),
      status: 'pending'
    } as MaintenanceRequest;

    // Optimistic update
    setRequests((prev) => [optimisticRequest, ...prev]);

    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;

      // Replace optimistic request with real data
      setRequests((prev) =>
        prev.map((r) => (r.id === tempId ? data : r))
      );
      
      return { data, error: null };
    } catch (err) {
      // Revert optimistic update on error
      setRequests((prev) => prev.filter((r) => r.id !== tempId));
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  /**
   * Updates an existing maintenance request with optimistic update
   * @param id - The ID of the request to update
   * @param updates - The update data
   * @returns Object containing the updated data or error
   */
  const updateRequest = async (
    id: string,
    updates: Database['public']['Tables']['maintenance_requests']['Update']
  ) => {
    // Store previous state for rollback
    const previousRequests = [...requests];

    // Optimistic update
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? { ...request, ...updates } : request))
    );

    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      // Revert optimistic update on error
      setRequests(previousRequests);
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    requests,
    loading,
    error,
    refetch: (force = false) => fetchRequests(force),
    createRequest,
    updateRequest,
  };
}