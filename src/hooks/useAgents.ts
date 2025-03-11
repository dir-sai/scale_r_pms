import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Limit results to prevent memory issues

      if (fetchError) {
        throw fetchError;
      }

      setAgents(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const refetch = useCallback(() => {
    return fetchAgents();
  }, [fetchAgents]);

  return { 
    agents, 
    loading, 
    error,
    refetch 
  };
}