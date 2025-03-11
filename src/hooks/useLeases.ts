import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Lease = Database['public']['Tables']['leases']['Row'];

export function useLeases() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeases = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('leases')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setLeases(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLeases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeases();
  }, [fetchLeases]);

  const createLease = async (lease: Database['public']['Tables']['leases']['Insert']) => {
    try {
      const { data, error } = await supabase.from('leases').insert(lease).select().single();

      if (error) throw error;

      setLeases((prev) => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateLease = async (id: string, updates: Database['public']['Tables']['leases']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('leases')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLeases((prev) => prev.map((lease) => (lease.id === id ? { ...lease, ...data } : lease)));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return {
    leases,
    loading,
    error,
    refetch: fetchLeases,
    createLease,
    updateLease,
  };
}