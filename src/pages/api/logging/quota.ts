import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get current month's logging usage from your database
    const { data, error } = await supabase
      .from('logging_metrics')
      .select('usage')
      .gte('created_at', new Date(new Date().setDate(1)).toISOString())
      .single();

    if (error) throw error;

    return res.status(200).json({ usage: data.usage });
  } catch (error) {
    console.error('Error fetching logging quota:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}