
import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { StoreConfigProvider } from './contexts/StoreConfigContext'
import Layout from './components/Layout.tsx'
import MobileLayout from './components/MobileLayout.jsx'

import Dashboard from './components/Dashboard.tsx'
import AddProduct from './components/AddProduct.tsx'
import Inventory from './components/Inventory.tsx'
import RecordPurchase from './components/RecordPurchase.tsx'
import RecordSale from './components/RecordSale.tsx'
import Suppliers from './components/Suppliers.tsx'
import StoreSettings from './components/StoreSettings.tsx'
import Welcome from './components/Welcome.tsx'
import CustomerList from './components/CustomerList.tsx'
import Scan from './components/Scan.tsx'

const LazyAdvancedReports = lazy(() => import('./components/Reports/AdvancedReports.jsx'));
const LazyCompetitiveFeaturesPage = lazy(() => import('./components/CompetitiveFeatures/CompetitiveFeaturesPage.jsx'));

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint is 768px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const CurrentLayout = isMobile ? MobileLayout : Layout;

  return (
    <StoreConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<CurrentLayout><Dashboard /></CurrentLayout>} />
          <Route path="/add-product" element={<CurrentLayout><AddProduct /></CurrentLayout>} />
          <Route path="/inventory" element={<CurrentLayout><Inventory /></CurrentLayout>} />
          <Route path="/purchase" element={<CurrentLayout><RecordPurchase /></CurrentLayout>} />
          <Route path="/sale" element={<CurrentLayout><RecordSale /></CurrentLayout>} />
          <Route path="/suppliers" element={<CurrentLayout><Suppliers /></CurrentLayout>} />
          <Route path="/settings" element={<CurrentLayout><StoreSettings /></CurrentLayout>} />
          <Route path="/reports" element={<CurrentLayout><Suspense fallback={<div>Loading Reports...</div>}><LazyAdvancedReports /></Suspense></CurrentLayout>} />
          <Route path="/customers" element={<CurrentLayout><CustomerList /></CurrentLayout>} />
          <Route path="/scan" element={<CurrentLayout><Scan /></CurrentLayout>} />
          <Route path="/competitive-features" element={<CurrentLayout><Suspense fallback={<div>Loading Features...</div>}><LazyCompetitiveFeaturesPage /></Suspense></CurrentLayout>} />
        </Routes>
      </Router>
    </StoreConfigProvider>
  )
}

export default App
