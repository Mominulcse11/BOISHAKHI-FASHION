/*
  # Complete Database Initialization for Bengali Clothing Shop

  1. Database Schema
    - Creates all required tables with proper constraints
    - Sets up foreign key relationships
    - Adds indexes for performance optimization
    - Includes proper data types and defaults

  2. Business Logic Functions
    - Stock management triggers
    - Data validation functions
    - Automatic calculations

  3. Security & Access
    - Disables RLS for development
    - Ensures public access for testing
    - Includes proper error handling

  4. Sample Data
    - Adds initial product categories
    - Creates sample products for testing
*/

-- Drop existing tables if they exist (for clean initialization)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS update_stock_on_purchase() CASCADE;
DROP FUNCTION IF EXISTS update_stock_on_sale() CASCADE;
DROP FUNCTION IF EXISTS validate_sale_stock() CASCADE;

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(name) > 0),
  category text NOT NULL CHECK (length(category) > 0),
  size text NOT NULL CHECK (length(size) > 0),
  purchase_price numeric NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  selling_price numeric NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create purchases table
CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier text NOT NULL CHECK (length(supplier) > 0),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity > 0),
  purchase_price numeric NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  purchase_date timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity > 0),
  selling_price numeric NOT NULL DEFAULT 0 CHECK (selling_price >= 0),
  total_price numeric NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  sale_date timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier);

CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);

-- Function to update stock when purchase is made
CREATE OR REPLACE FUNCTION update_stock_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product stock by adding purchased quantity
  UPDATE products 
  SET 
    stock = stock + NEW.quantity,
    purchase_price = NEW.purchase_price,
    updated_at = now()
  WHERE id = NEW.product_id;
  
  -- Check if product exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with id % not found', NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to validate and update stock when sale is made
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
DECLARE
  current_stock integer;
  product_name text;
BEGIN
  -- Get current stock and product name
  SELECT stock, name INTO current_stock, product_name
  FROM products 
  WHERE id = NEW.product_id;
  
  -- Check if product exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product with id % not found', NEW.product_id;
  END IF;
  
  -- Check if sufficient stock is available
  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product "%". Available: %, Requested: %', 
      product_name, current_stock, NEW.quantity;
  END IF;
  
  -- Update product stock by subtracting sold quantity
  UPDATE products 
  SET 
    stock = stock - NEW.quantity,
    updated_at = now()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER purchase_stock_update
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_purchase();

CREATE TRIGGER sale_stock_update
  BEFORE INSERT ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_on_sale();

-- Disable RLS for development (enable for production)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE sales DISABLE ROW LEVEL SECURITY;

-- Insert sample data for testing
INSERT INTO products (name, category, size, purchase_price, selling_price, stock) VALUES
  ('Cotton Saree - Red', 'Saree', 'Free Size', 800.00, 1200.00, 15),
  ('Silk Saree - Blue', 'Saree', 'Free Size', 1500.00, 2200.00, 8),
  ('Cotton Panjabi - White', 'Panjabi', 'L', 600.00, 900.00, 12),
  ('Linen Panjabi - Cream', 'Panjabi', 'XL', 750.00, 1100.00, 10),
  ('Casual Shirt - Blue', 'Shirt', 'M', 400.00, 650.00, 20),
  ('Formal Shirt - White', 'Shirt', 'L', 500.00, 750.00, 18),
  ('Cotton T-shirt - Black', 'T-shirt', 'L', 250.00, 400.00, 25),
  ('Printed T-shirt - Red', 'T-shirt', 'M', 300.00, 450.00, 22),
  ('Denim Jeans - Blue', 'Jeans', '32', 800.00, 1200.00, 14),
  ('Casual Pant - Black', 'Pant', '34', 600.00, 900.00, 16),
  ('Embroidered Kurta - White', 'Kurta', 'L', 700.00, 1050.00, 12),
  ('Designer Salwar Kameez', 'Salwar Kameez', 'M', 1200.00, 1800.00, 6),
  ('Silk Dupatta - Golden', 'Dupatta', 'Free Size', 300.00, 500.00, 20),
  ('Woolen Shawl - Brown', 'Shawl', 'Free Size', 400.00, 650.00, 8),
  ('Cotton Lungi - Checkered', 'Lungi', 'Free Size', 200.00, 350.00, 30),
  ('Traditional Gamcha', 'Gamcha', 'Free Size', 80.00, 150.00, 50);

-- Insert sample purchase records
INSERT INTO purchases (product_id, supplier, quantity, purchase_price) 
SELECT id, 'Rahman Textiles', 5, purchase_price 
FROM products 
WHERE category IN ('Saree', 'Panjabi') 
LIMIT 3;

INSERT INTO purchases (product_id, supplier, quantity, purchase_price) 
SELECT id, 'Dhaka Fashion House', 10, purchase_price 
FROM products 
WHERE category IN ('Shirt', 'T-shirt') 
LIMIT 4;

-- Insert sample sales records
INSERT INTO sales (product_id, quantity, selling_price, total_price)
SELECT 
  id, 
  2, 
  selling_price, 
  selling_price * 2
FROM products 
WHERE stock > 5 
LIMIT 5;