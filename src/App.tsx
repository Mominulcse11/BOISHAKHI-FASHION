import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import Inventory from './components/Inventory'
import RecordPurchase from './components/RecordPurchase'
import RecordSale from './components/RecordSale'
import Suppliers from './components/Suppliers'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchase" element={<RecordPurchase />} />
          <Route path="/sale" element={<RecordSale />} />
          <Route path="/suppliers" element={<Suppliers />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App