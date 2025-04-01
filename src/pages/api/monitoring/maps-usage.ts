import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { endpoint, success, timestamp } = req.body;

    // Log to Supabase
    const { error } = await supabase
      .from('maps_api_usage')
      .insert([
        {
          endpoint,
          success,
          timestamp,
          user_ip: req.headers['x-forwarded-for'] || 'unknown',
          user_agent: req.headers['user-agent']
        }
      ]);

    if (error) throw error;

    return res.status(200).json({ message: 'Usage logged successfully' });
  } catch (error) {
    console.error('Failed to log Maps API usage:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}