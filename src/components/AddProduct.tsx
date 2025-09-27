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
        custom_attributes: (() => {
          const raw = { ...(formData.custom_attributes || {}) } as Record<string, any>
          // Build nested variants object from comma-separated fields if present
          const toArray = (v?: string) => (v ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined)
          const variants = {
            sizes: toArray(raw.variants_sizes),
            colors: toArray(raw.variants_colors),
            materials: toArray(raw.variants_materials)
          }
          // Remove temp fields
          delete raw.variants_sizes
          delete raw.variants_colors
          delete raw.variants_materials
          return {
            ...raw,
            ...(variants.sizes || variants.colors || variants.materials ? { variants } : {})
          }
        })()
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

          {/* Fashion-specific fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Fashion Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="custom_barcode" className="block text-sm font-medium text-gray-700 mb-1">Barcode / SKU</label>
                <input
                  type="text"
                  id="custom_barcode"
                  name="custom_barcode"
                  value={(formData.custom_attributes as any).barcode || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Scan or enter barcode"
                />
              </div>
              <div>
                <label htmlFor="custom_brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  id="custom_brand"
                  name="custom_brand"
                  value={(formData.custom_attributes as any).brand || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brand name"
                />
              </div>
              <div>
                <label htmlFor="custom_style_code" className="block text-sm font-medium text-gray-700 mb-1">Style Code</label>
                <input
                  type="text"
                  id="custom_style_code"
                  name="custom_style_code"
                  value={(formData.custom_attributes as any).style_code || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., ST-2024-001"
                />
              </div>
              <div>
                <label htmlFor="custom_season" className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <input
                  type="text"
                  id="custom_season"
                  name="custom_season"
                  value={(formData.custom_attributes as any).season || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Spring 2024"
                />
              </div>
              <div>
                <label htmlFor="custom_collection" className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                <input
                  type="text"
                  id="custom_collection"
                  name="custom_collection"
                  value={(formData.custom_attributes as any).collection || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Summer Collection"
                />
              </div>
              <div>
                <label htmlFor="custom_variants_sizes" className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                <input
                  type="text"
                  id="custom_variants_sizes"
                  name="custom_variants_sizes"
                  value={(formData.custom_attributes as any).variants_sizes || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="S,M,L,XL"
                />
              </div>
              <div>
                <label htmlFor="custom_variants_colors" className="block text-sm font-medium text-gray-700 mb-1">Colors (comma-separated)</label>
                <input
                  type="text"
                  id="custom_variants_colors"
                  name="custom_variants_colors"
                  value={(formData.custom_attributes as any).variants_colors || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Red,Blue,Black"
                />
              </div>
              <div>
                <label htmlFor="custom_variants_materials" className="block text-sm font-medium text-gray-700 mb-1">Materials (comma-separated)</label>
                <input
                  type="text"
                  id="custom_variants_materials"
                  name="custom_variants_materials"
                  value={(formData.custom_attributes as any).variants_materials || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cotton,Silk,Polyester"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="custom_care_instructions" className="block text-sm font-medium text-gray-700 mb-1">Care Instructions</label>
                <input
                  type="text"
                  id="custom_care_instructions"
                  name="custom_care_instructions"
                  value={(formData.custom_attributes as any).care_instructions || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Machine wash cold"
                />
              </div>
              <div>
                <label htmlFor="custom_country_of_origin" className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  id="custom_country_of_origin"
                  name="custom_country_of_origin"
                  value={(formData.custom_attributes as any).country_of_origin || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Bangladesh"
                />
              </div>
            </div>
          </div>

          {/* Custom Attributes from Store Settings */}
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