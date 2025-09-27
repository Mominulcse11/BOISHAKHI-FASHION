import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { StoreConfigProvider } from './contexts/StoreConfigContext'
import Layout from './components/Layout'
import MobileLayout from './components/MobileLayout' // Corrected import path
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import Inventory from './components/Inventory'
import RecordPurchase from './components/RecordPurchase'
import RecordSale from './components/RecordSale'
import Suppliers from './components/Suppliers'
import StoreSettings from './components/StoreSettings'
import Welcome from './components/Welcome'
import AdvancedReports from './components/AdvancedReports' // Corrected import path

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
          <Route path="/reports" element={<CurrentLayout><AdvancedReports /></CurrentLayout>} />
        </Routes>
      </Router>
    </StoreConfigProvider>
  )
}

export default App
