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
      tenants: {
        Row: {
          id: string
          created_at: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          emergency_contact: string | null
          documents: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          emergency_contact?: string | null
          documents?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          emergency_contact?: string | null
          documents?: Json | null
        }
      }
      leases: {
        Row: {
          id: string
          created_at: string
          property_id: string
          tenant_id: string
          start_date: string
          end_date: string
          monthly_rent: number
          security_deposit: number
          status: 'active' | 'expired' | 'terminated' | 'pending'
          terms: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          tenant_id: string
          start_date: string
          end_date: string
          monthly_rent: number
          security_deposit: number
          status?: 'active' | 'expired' | 'terminated' | 'pending'
          terms?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          tenant_id?: string
          start_date?: string
          end_date?: string
          monthly_rent?: number
          security_deposit?: number
          status?: 'active' | 'expired' | 'terminated' | 'pending'
          terms?: Json | null
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