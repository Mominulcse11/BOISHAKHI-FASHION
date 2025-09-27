# Universal Store Management System - Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New project"
4. Choose your organization
5. Fill in project details:
   - **Name**: Universal Store Management
   - **Database Password**: Choose a secure password
   - **Region**: Choose the closest region to you
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (something like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (the long JWT token)

## Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

## Step 4: Set Up Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase-setup.sql` file
4. Paste it in the SQL editor
5. Click "Run" to execute the setup script

## Step 5: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```
2. The Database Status should now show:
   - Connection: Connected ✓
   - Tables: Ready ✓
   - Sample Data: Available ✓

## Step 6: Configure Your Store

1. Go to "Store Settings" in the navigation
2. Set up your store:
   - Store Name
   - Business Type (Clothing, Food, Electronics, etc.)
   - Currency Symbol
   - Product Categories
   - Custom Attributes

## Troubleshooting

### Database Connection Issues
- Verify your `.env` file has the correct credentials
- Make sure there are no extra spaces or quotes around the values
- Check that your Supabase project is active

### Permission Issues
- The setup script includes RLS (Row Level Security) policies
- For development, we use permissive policies
- In production, you should implement proper user authentication

### Table Creation Issues
- Make sure you ran the entire `supabase-setup.sql` script
- Check the Supabase logs in your dashboard for any errors

## Sample Store Configurations

### Clothing Store
- Categories: Shirts, Pants, Dresses, Shoes, Accessories
- Uses Sizes: Yes
- Size Options: XS, S, M, L, XL, XXL
- Custom Attributes: Color, Material, Brand

### Food Store/Restaurant
- Categories: Appetizers, Main Course, Desserts, Beverages
- Uses Sizes: No
- Custom Attributes: Ingredients, Allergens, Expiry Date

### Electronics Store
- Categories: Smartphones, Laptops, Accessories, Gaming
- Uses Sizes: No
- Custom Attributes: Brand, Model, Warranty Period, Specifications

### Bookstore
- Categories: Fiction, Non-Fiction, Educational, Children
- Uses Sizes: No
- Custom Attributes: Author, Publisher, ISBN, Pages

## Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project is running
3. Ensure all environment variables are correctly set
4. Check that the database tables were created successfully