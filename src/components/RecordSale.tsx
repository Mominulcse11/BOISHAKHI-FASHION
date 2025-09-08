import React, { useState, useEffect } from 'react'
import { productService } from '../services/productService'
import { salesService } from '../services/salesService'
import { Product } from '../types/database'

const RecordSale: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: ''
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
      setProducts(data.filter(p => p.stock > 0)) // Only show products with stock
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
      const selectedProduct = products.find(p => p.id === formData.product_id)
      if (!selectedProduct) {
        throw new Error('Product not found')
      }

      const quantity = parseInt(formData.quantity)
      if (quantity > selectedProduct.stock) {
        throw new Error(`Insufficient stock. Available: ${selectedProduct.stock}, Requested: ${quantity}`)
      }

      const saleData = {
        product_id: formData.product_id,
        quantity: quantity,
        selling_price: selectedProduct.selling_price,
        total_price: selectedProduct.selling_price * quantity
      }

      await salesService.createSale(saleData)
      
      // Reload products to show updated stock
      await loadProducts()
      
      setSuccess(true)
      setFormData({
        product_id: '',
        quantity: ''
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error recording sale:', err)
      setError(err.message || 'Failed to record sale')
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
  const quantity = parseInt(formData.quantity || '0')
  const totalAmount = selectedProduct ? selectedProduct.selling_price * quantity : 0
  const profit = selectedProduct ? (selectedProduct.selling_price - selectedProduct.purchase_price) * quantity : 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Record Sale</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-600">Sale recorded successfully! Stock has been updated.</p>
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
                  {product.name} - {product.category} ({product.size}) - Stock: {product.stock} - ৳{product.selling_price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Available Stock:</span>
                  <span className="ml-2 font-medium">{selectedProduct.stock} units</span>
                </div>
                <div>
                  <span className="text-blue-700">Selling Price:</span>
                  <span className="ml-2 font-medium">৳{selectedProduct.selling_price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Purchase Price:</span>
                  <span className="ml-2 font-medium">৳{selectedProduct.purchase_price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Profit per Unit:</span>
                  <span className="ml-2 font-medium text-green-600">
                    ৳{(selectedProduct.selling_price - selectedProduct.purchase_price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity to Sell *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              max={selectedProduct?.stock || 1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="1"
            />
            {selectedProduct && (
              <p className="text-sm text-gray-600 mt-1">
                Maximum available: {selectedProduct.stock} units
              </p>
            )}
          </div>

          {selectedProduct && quantity > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Sale Amount:</span>
                <span className="text-xl font-bold text-gray-900">৳{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Profit:</span>
                <span className="text-lg font-bold text-green-600">৳{profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Remaining Stock After Sale:</span>
                <span>{selectedProduct.stock - quantity} units</span>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedProduct || quantity <= 0 || quantity > (selectedProduct?.stock || 0)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RecordSale