import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StoreConfigProvider } from './contexts/StoreConfigContext'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import Inventory from './components/Inventory'
import RecordPurchase from './components/RecordPurchase'
import RecordSale from './components/RecordSale'
import Suppliers from './components/Suppliers'
import StoreSettings from './components/StoreSettings'
import Welcome from './components/Welcome'

function App() {
  return (
    <StoreConfigProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/add-product" element={<Layout><AddProduct /></Layout>} />
          <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
          <Route path="/purchase" element={<Layout><RecordPurchase /></Layout>} />
          <Route path="/sale" element={<Layout><RecordSale /></Layout>} />
          <Route path="/suppliers" element={<Layout><Suppliers /></Layout>} />
          <Route path="/settings" element={<Layout><StoreSettings /></Layout>} />
        </Routes>
      </Router>
    </StoreConfigProvider>
  )
}

export default App