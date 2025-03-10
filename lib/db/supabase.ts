import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'scale-r-pms'
      }
    }
  }
)

export async function handleDatabaseError<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error('Database operation failed:', error)
    throw new Error('Database operation failed')
  }
}

export async function executeTransaction<T>(
  callback: (client: typeof supabase) => Promise<T>
): Promise<T> {
  try {
    return await callback(supabase)
  } catch (error) {
    console.error('Transaction failed:', error)
    throw new Error('Transaction failed')
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          price: number
          location: Json
          features: string[]
          type: string
          status: string
          landlord_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          price: number
          location: Json
          features: string[]
          type: string
          status?: string
          landlord_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          price?: number
          location?: Json
          features?: string[]
          type?: string
          status?: string
          landlord_id?: string
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          priority: string
          status: string
          property_id: string
          tenant_id: string
          category: string
          available_dates: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          priority: string
          status?: string
          property_id: string
          tenant_id: string
          category: string
          available_dates: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          priority?: string
          status?: string
          property_id?: string
          tenant_id?: string
          category?: string
          available_dates?: string[]
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          amount: number
          method: string
          description: string
          property_id: string
          tenant_id: string
          date: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          amount: number
          method: string
          description: string
          property_id: string
          tenant_id: string
          date: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          amount?: number
          method?: string
          description?: string
          property_id?: string
          tenant_id?: string
          date?: string
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 