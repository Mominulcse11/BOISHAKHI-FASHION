/*
  # Fix Row-Level Security Policies

  1. Security Updates
    - Fix RLS policies for products table to allow authenticated users to insert/update/delete
    - Fix RLS policies for purchases table to allow authenticated users to insert
    - Fix RLS policies for sales table to allow authenticated users to insert
    - Ensure all policies work correctly with Supabase authentication

  2. Policy Changes
    - Products: Allow all CRUD operations for authenticated users
    - Purchases: Allow insert and select for authenticated users
    - Sales: Allow insert and select for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read products" ON products;
DROP POLICY IF EXISTS "Users can insert products" ON products;
DROP POLICY IF EXISTS "Users can update products" ON products;
DROP POLICY IF EXISTS "Users can delete products" ON products;

DROP POLICY IF EXISTS "Users can read purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert purchases" ON purchases;

DROP POLICY IF EXISTS "Users can read sales" ON sales;
DROP POLICY IF EXISTS "Users can insert sales" ON sales;

-- Create new policies for products table
CREATE POLICY "Enable read access for authenticated users" ON products
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON products
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users" ON products
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for authenticated users" ON products
  FOR DELETE TO authenticated
  USING (true);

-- Create new policies for purchases table
CREATE POLICY "Enable read access for authenticated users" ON purchases
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON purchases
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create new policies for sales table
CREATE POLICY "Enable read access for authenticated users" ON sales
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON sales
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;