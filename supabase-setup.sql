-- Universal Store Management System Database Setup
-- Run this in your Supabase SQL editor

-- Create store_config table for store settings
CREATE TABLE IF NOT EXISTS store_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  categories TEXT[] NOT NULL,
  uses_sizes BOOLEAN NOT NULL DEFAULT false,
  size_options TEXT[],
  custom_attributes JSONB,
  currency_symbol TEXT NOT NULL DEFAULT '৳',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table (updated for flexibility)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT, -- Now optional
  purchase_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  custom_attributes JSONB, -- For flexible product attributes
  variants JSONB, -- New: For product variants (sizes, colors, materials)
  season TEXT, -- New: E.g., 'Spring 2024'
  collection TEXT, -- New: E.g., 'Summer Collection'
  brand TEXT, -- New: E.g., 'Brand Name'
  style_code TEXT, -- New: E.g., 'ST-2024-001'
  care_instructions TEXT, -- New: E.g., 'Machine wash cold'
  country_of_origin TEXT, -- New: E.g., 'Bangladesh'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  supplier TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- Note: In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on store_config" ON store_config FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on purchases" ON purchases FOR ALL USING (true);
CREATE POLICY "Allow all operations on sales" ON sales FOR ALL USING (true);


-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_store_config_updated_at
    BEFORE UPDATE ON store_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default store configuration
INSERT INTO store_config (store_name, business_type, categories, uses_sizes, size_options, custom_attributes, currency_symbol)
VALUES (
  'Universal Store',
  'general',
  ARRAY['General'],
  false,
  ARRAY[]::TEXT[],
  '[]'::jsonb,
  '৳'
);

-- Insert sample data for different store types
-- Example: Clothing store products
INSERT INTO products (name, category, size, purchase_price, selling_price, stock, custom_attributes, variants, season, collection, brand, style_code, care_instructions, country_of_origin) VALUES
('Cotton T-Shirt', 'T-shirt', 'M', 500.00, 800.00, 15, '{"color": "Blue", "material": "Cotton"}'::jsonb, '{"sizes": ["S", "M", "L"], "colors": ["Red", "Blue"]}'::jsonb, 'Spring 2024', 'Summer Collection', 'Fashion Brand', 'ST-2024-001', 'Machine wash cold', 'Bangladesh'),
('Denim Jeans', 'Jeans', 'L', 1200.00, 1800.00, 8, '{"color": "Dark Blue", "material": "Denim"}'::jsonb, '{"sizes": ["S", "M", "L"], "colors": ["Dark Blue", "Black"]}'::jsonb, 'Spring 2024', 'Summer Collection', 'Fashion Brand', 'ST-2024-002', 'Machine wash cold', 'Bangladesh');

-- Example: Food store products (no size)
INSERT INTO products (name, category, purchase_price, selling_price, stock, custom_attributes) VALUES
('Organic Apples', 'Fruits', 150.00, 200.00, 50, '{"brand": "Fresh Farm", "weight": "1kg"}'::jsonb),
('Whole Wheat Bread', 'Bakery', 50.00, 80.00, 20, '{"brand": "Daily Fresh", "expiry": "3 days"}'::jsonb);
