# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- Stack: React 18 + TypeScript + Vite + Tailwind CSS on the frontend; Supabase (PostgreSQL) as the backend-as-a-service.
- Data access: A service layer talks to Supabase. If environment variables are not configured, the app automatically falls back to mock data so the UI remains usable during development.
- Setup references: See README.md and SETUP_GUIDE.md. Database schema lives in supabase-setup.sql. You can verify environment configuration with verify-setup.js.

Commands (pwsh)
- Install dependencies: npm install
- Start dev server: npm run dev
- Build for production: npm run build
- Preview local production build: npm run preview
- Lint all files: npm run lint
- Lint a specific file: npx eslint src/path/to/File.tsx
- Verify environment/setup: node verify-setup.js
- Create .env from example (PowerShell): Copy-Item .env.example .env

Notes on testing
- No test framework or test script is configured in package.json. There are no Jest/Vitest configs present.

Environment configuration
- Required variables (see .env.example):
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- These are consumed by src/lib/supabase.ts. When missing, the app uses placeholder values and the data layer falls back to mock data.

High-level architecture
- Entry + bootstrapping
  - index.html loads /src/main.tsx.
  - src/main.tsx renders <App /> and loads global styles (src/index.css).
- Application shell and routing
  - src/App.tsx sets up BrowserRouter routes for the main pages (welcome, dashboard, inventory, purchase/sale, suppliers, store settings, customers, reports, competitive features).
  - App selects between a desktop Layout and a MobileLayout based on window width; heavy pages (e.g., reports, competitive features) are lazy-loaded with React.Suspense.
- State and context
  - Store configuration is provided via src/contexts/StoreConfigContext.tsx, which persists and retrieves a StoreConfig (store_name, business_type, categories, size rules, currency, etc.) via the storeConfigService.
  - Authentication support is implemented in src/contexts/AuthContext.tsx using Supabase Auth; it exposes signUp/signIn/signOut/resetPassword and watches session changes. Auth UI lives under src/components/auth/.
- Data layer (service + DB manager)
  - Supabase client is created in src/lib/supabase.ts from VITE_* env vars.
  - src/lib/database.ts contains DatabaseManager: on initialize(), it probes Supabase and verifies required tables; on failure or missing env, it enables mock mode with in-memory sample entities. It also exposes a health probe used by the UI.
  - Services encapsulate CRUD and analytics queries and automatically initialize the DB manager before use:
    - src/services/productService.ts — list/create/update/delete products, low-stock queries, mock fallback.
    - src/services/purchaseService.ts — list/create purchases, supplier aggregations.
    - src/services/salesService.ts — list/create sales, today/month-to-date aggregates, 30-day series, top sellers.
    - src/services/storeConfigService.ts — load/create/update store_config and expose predefined business types for bootstrapping configuration.
  - Strong types for entities and DTOs live in src/types/database.ts (Product, Purchase, Sale, StoreConfig, BusinessType, etc.).
- UI composition
  - src/components/Layout.tsx renders top navigation and responsive layout; menu links cover dashboard, inventory, purchase/sale, suppliers, settings, reports, customers, competitive features.
  - src/components/Dashboard.tsx stitches together service results (today/month metrics, 30-day chart via recharts, low stock, top sellers) and embeds DatabaseStatus.
  - src/components/DatabaseStatus.tsx calls dbManager.getHealthStatus() and surfaces connection/table/sample-data status; when env is missing or DB fails, it explicitly indicates mock data mode.

Build and tooling
- Vite configuration: vite.config.ts with @vitejs/plugin-react; lucide-react excluded from optimizeDeps. TypeScript project references split app/node configs via tsconfig.json, tsconfig.app.json, tsconfig.node.json.
- Linting: eslint.config.js uses typescript-eslint, @eslint/js, react-hooks plugin, and react-refresh rules; dist is ignored.

Operational tips for Warp
- If verify-setup.js reports missing env values, do not print secrets. Ask the user to populate .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then re-run node verify-setup.js followed by npm run dev.
- For data issues during development, check DatabaseStatus in the Dashboard page; if using mock mode, Supabase is not required to continue UI work.
