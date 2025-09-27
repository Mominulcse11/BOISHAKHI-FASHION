import React, { useState } from 'react'
import { productService } from '../services/productService'
import { Product } from '../types/database'
import { useStoreConfig } from '../contexts/StoreConfigContext'

const AddProduct: React.FC = () => {
  const { storeConfig, loading: configLoading } = useStoreConfig()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    size: '',
    purchase_price: '',
    selling_price: '',
    stock: '',
    custom_attributes: {} as Record<string, any>
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        ...(storeConfig?.uses_sizes && formData.size ? { size: formData.size } : {}),
        purchase_price: parseFloat(formData.purchase_price),
        selling_price: parseFloat(formData.selling_price),
        stock: parseInt(formData.stock),
        custom_attributes: formData.custom_attributes
      }

      await productService.createProduct(productData)
      setSuccess(true)
      setFormData({
        name: '',
        category: '',
        size: '',
        purchase_price: '',
        selling_price: '',
        stock: '',
        custom_attributes: {}
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error adding product:', err)
      setError(err.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('custom_')) {
      const attributeName = name.replace('custom_', '')
      setFormData(prev => ({
        ...prev,
        custom_attributes: {
          ...prev.custom_attributes,
          [attributeName]: value
        }
      }))
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Loading store configuration...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-600">Product added successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Cotton Saree, Linen Panjabi"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                {storeConfig?.categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {storeConfig?.uses_sizes && (
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size {storeConfig?.uses_sizes ? '*' : ''}
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required={storeConfig?.uses_sizes}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select size</option>
                  {storeConfig?.size_options?.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price ({storeConfig?.currency_symbol || '৳'}) *
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

            <div>
              <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price ({storeConfig?.currency_symbol || '৳'}) *
              </label>
              <input
                type="number"
                step="0.01"
                id="selling_price"
                name="selling_price"
                value={formData.selling_price}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Custom Attributes */}
          {storeConfig?.custom_attributes && storeConfig.custom_attributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {storeConfig.custom_attributes.map((attr) => (
                  <div key={attr.name}>
                    <label 
                      htmlFor={`custom_${attr.name}`} 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {attr.name}
                    </label>
                    {attr.type === 'select' ? (
                      <select
                        id={`custom_${attr.name}`}
                        name={`custom_${attr.name}`}
                        value={formData.custom_attributes[attr.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select {attr.name.toLowerCase()}</option>
                        {attr.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={attr.type === 'number' ? 'number' : 'text'}
                        id={`custom_${attr.name}`}
                        name={`custom_${attr.name}`}
                        value={formData.custom_attributes[attr.name] || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${attr.name.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct