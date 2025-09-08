import React, { useState, useEffect } from 'react'
import { Users, Package } from 'lucide-react'
import { purchaseService } from '../services/purchaseService'

interface SupplierStats {
  supplier: string
  totalAmount: number
  totalQuantity: number
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      const data = await purchaseService.getPurchasesBySupplier()
      setSuppliers(data.sort((a, b) => b.totalAmount - a.totalAmount))
    } catch (err: any) {
      console.error('Error loading suppliers:', err)
      setError(err.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={loadSuppliers}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {suppliers.length === 0 && !loading ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No suppliers found. Record some purchases to see supplier data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.supplier} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.supplier}</h3>
                  <p className="text-sm text-gray-600">Supplier</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Purchase Amount:</span>
                  <span className="font-semibold text-gray-900">৳{supplier.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Items Purchased:</span>
                  <span className="font-semibold text-blue-600">{supplier.totalQuantity} units</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Price per Unit:</span>
                  <span className="font-semibold text-green-600">
                    ৳{(supplier.totalAmount / supplier.totalQuantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-1" />
                  <span>Business Partner</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {suppliers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplier Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{suppliers.length}</p>
              <p className="text-sm text-gray-600">Total Suppliers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ৳{suppliers.reduce((sum, s) => sum + s.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Purchase Amount</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {suppliers.reduce((sum, s) => sum + s.totalQuantity, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Items Purchased</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Suppliers