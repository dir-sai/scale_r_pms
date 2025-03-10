/*
  # Property Management System Core Schema

  1. New Tables
    - `properties`
      - Core property details including location, pricing, status
    - `tenants` 
      - Tenant information and contact details
    - `leases`
      - Lease agreements linking properties and tenants
    - `payments`
      - Payment records and transaction history
    - `maintenance_requests`
      - Property maintenance and issue tracking
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper data access control
    
  3. Relationships
    - Foreign key constraints between related tables
    - Indexes for frequently queried columns
*/

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  address text NOT NULL,
  description text,
  monthly_rent decimal NOT NULL,
  status text NOT NULL DEFAULT 'available',
  features jsonb,
  images text[],
  owner_id uuid REFERENCES auth.users(id),
  CHECK (status IN ('available', 'occupied', 'maintenance', 'inactive'))
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  emergency_contact text,
  documents jsonb
);

-- Leases Table
CREATE TABLE IF NOT EXISTS leases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id),
  tenant_id uuid REFERENCES tenants(id),
  start_date date NOT NULL,
  end_date date NOT NULL,
  monthly_rent decimal NOT NULL,
  security_deposit decimal NOT NULL,
  status text NOT NULL DEFAULT 'active',
  terms jsonb,
  CHECK (status IN ('active', 'expired', 'terminated', 'pending'))
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lease_id uuid REFERENCES leases(id),
  amount decimal NOT NULL,
  payment_date timestamptz NOT NULL,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  transaction_id text,
  CHECK (status IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id),
  tenant_id uuid REFERENCES tenants(id),
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  assigned_to uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  images text[],
  CHECK (priority IN ('low', 'medium', 'high', 'emergency')),
  CHECK (status IN ('pending', 'in_progress', 'resolved', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Properties Policies
CREATE POLICY "Public properties are viewable by everyone"
  ON properties FOR SELECT
  USING (status = 'available');

CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid() OR id IN (
    SELECT property_id FROM leases WHERE tenant_id IN (
      SELECT id FROM tenants WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Property owners can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Tenants Policies
CREATE POLICY "Users can view and manage their own tenant profile"
  ON tenants FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Leases Policies
CREATE POLICY "Users can view their related leases"
  ON leases FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()) OR
    property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())
  );

-- Payments Policies
CREATE POLICY "Users can view their related payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    lease_id IN (
      SELECT id FROM leases WHERE 
        tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()) OR
        property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())
    )
  );

-- Maintenance Requests Policies
CREATE POLICY "Users can view and create maintenance requests for their properties"
  ON maintenance_requests FOR ALL
  TO authenticated
  USING (
    tenant_id IN (SELECT id FROM tenants WHERE user_id = auth.uid()) OR
    property_id IN (SELECT id FROM properties WHERE owner_id = auth.uid())
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_tenants_user ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_leases_property ON leases(property_id);
CREATE INDEX IF NOT EXISTS idx_leases_tenant ON leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_lease ON payments(lease_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_property ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tenant ON maintenance_requests(tenant_id);