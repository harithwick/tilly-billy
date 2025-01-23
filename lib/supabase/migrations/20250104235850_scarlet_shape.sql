/*
  # Add updated_at to invoice_items

  1. Changes
    - Add updated_at column to invoice_items
    - Add trigger for updating timestamp
*/

-- Add updated_at column
ALTER TABLE invoice_items 
ADD COLUMN updated_at timestamptz DEFAULT now();

-- Add trigger for updating timestamp
CREATE TRIGGER update_invoice_items_updated_at
  BEFORE UPDATE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();