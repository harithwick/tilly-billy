/*
  # Products Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `sku` (text)
      - `status` (enum)
      - `notes` (text)
      - Timestamps
    
  2. Security
    - Enable RLS
    - Add policies for product management
*/

-- Create the product status enum type
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2),
  sku text,
  status product_status DEFAULT 'active',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow organization members to view products
CREATE POLICY "Organization members can view products" ON products
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Allow organization members to manage products
CREATE POLICY "Organization members can manage products" ON products
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();