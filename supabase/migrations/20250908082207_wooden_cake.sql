/*
  # Disable RLS for Development Environment

  This migration temporarily disables Row Level Security (RLS) for development purposes.
  This allows the application to work without authentication setup.
  
  IMPORTANT: For production, you should enable RLS and set up proper authentication.

  1. Tables Modified
    - `products` - RLS disabled
    - `purchases` - RLS disabled  
    - `sales` - RLS disabled

  2. Security Changes
    - Temporarily disable RLS on all tables
    - Remove existing policies
    - Allow public access for development
*/

-- Disable RLS on all tables for development
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON products;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON purchases;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON purchases;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON sales;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON sales;