/*
  # Clients Schema

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text, nullable)
      - `company` (text, nullable)
      - `phone` (text, nullable)
      - `website` (text, nullable)
      - `vat_number` (text, nullable)
      - `billing_address` (jsonb)
      - `shipping_address` (jsonb)
      - `payment_terms` (integer)
      - `notes` (text)
      - `status` (enum)
      - Timestamps
    
  2. Security
    - Enable RLS
    - Add policies for client management
*/

-- Create the client status enum type
CREATE TYPE client_status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  company text,
  phone text,
  website text,
  vat_number text,
  billing_address jsonb,
  shipping_address jsonb,
  payment_terms integer DEFAULT 30,
  notes text,
  status client_status DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow organization members to view clients
CREATE POLICY "Organization members can view clients" ON clients
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Allow organization members to manage clients
CREATE POLICY "Organization members can manage clients" ON clients
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();