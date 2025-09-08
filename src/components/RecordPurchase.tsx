import React, { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { purchaseService } from '../services/purchaseService'
import { Product } from '../types/database'

const RecordPurchase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    product_id: '',
    supplier: '',
    quantity: '',
    purchase_price: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err: any) {
      console.error('Error loading products:', err)
      setError(err.message || 'Failed to load products')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const purchaseData = {
        product_id: formData.product_id,
        supplier: formData.supplier,
        quantity: parseInt(formData.quantity),
        purchase_price: parseFloat(formData.purchase_price)
      }

      await purchaseService.createPurchase(purchaseData)
      
      // Reload products to show updated stock
      await loadProducts()
      
      setSuccess(true)
      setFormData({
        product_id: '',
        supplier: '',
        quantity: '',
        purchase_price: ''
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error recording purchase:', err)
      setError(err.message || 'Failed to record purchase')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const selectedProduct = products.find(p => p.id === formData.product_id)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Record Purchase</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-600">Purchase recorded successfully! Stock has been updated.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">
              Select Product *
            </label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.category} ({product.size}) - Current Stock: {product.stock}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Current Stock:</span>
                  <span className="ml-2 font-medium">{selectedProduct.stock} units</span>
                </div>
                <div>
                  <span className="text-blue-700">Last Purchase Price:</span>
                  <span className="ml-2 font-medium">৳{selectedProduct.purchase_price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name *
            </label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., ABC Textiles, Rahman Fashion"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>

            <div>
              <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price per Unit (৳) *
              </label>
              <input
                type="number"
                step="0.01"
                id="purchase_price"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.quantity && formData.purchase_price && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Purchase Amount:</span>
                <span className="text-xl font-bold text-gray-900">
                  ৳{(parseInt(formData.quantity || '0') * parseFloat(formData.purchase_price || '0')).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecordPurchase