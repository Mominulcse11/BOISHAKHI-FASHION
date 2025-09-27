# Universal Store Management System

A flexible, universal store management system that can be customized for any type of business - from clothing stores to restaurants, electronics shops to bookstores.

## ✨ Features

- **Universal Design**: Configurable for any business type
- **Flexible Product Attributes**: Custom fields based on your store type
- **Inventory Management**: Track stock levels and product details
- **Sales & Purchase Tracking**: Record transactions with detailed analytics
- **Supplier Management**: Maintain supplier information
- **Real-time Analytics**: Dashboard with sales insights
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your Project URL and anon key from Settings > API
   - Update the `.env` file with your credentials

3. **Configure database**
   - Go to your Supabase dashboard > SQL Editor
   - Copy and run the `supabase-setup.sql` script

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Configure your store**
   - Open the application in your browser
   - Go to Store Settings to configure your business

### Quick Setup Verification
```bash
node verify-setup.js
```

## 🏪 Supported Business Types

- **Clothing Store**: Size variations, colors, materials
- **Food Store/Restaurant**: Expiry dates, ingredients, allergens
- **Electronics Store**: Brand, model, warranty, specifications
- **Bookstore**: Author, publisher, ISBN, genres
- **Pharmacy**: Dosage, prescriptions, expiry tracking
- **General Store**: Flexible categories and custom attributes

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite

## 📊 Features

- Universal store configuration
- Dynamic product forms
- Real-time inventory tracking
- Sales and purchase management
- Analytics dashboard
- Supplier management
- Custom business rules

## 📚 Documentation

- `SETUP_GUIDE.md` - Detailed setup instructions
- `supabase-setup.sql` - Database schema
- `verify-setup.js` - Configuration verification

## 🔧 Current Setup Status

Run `node verify-setup.js` to check your configuration status.
