import React, { useState, useEffect } from 'react'
import { useStoreConfig } from '../contexts/StoreConfigContext'
import { storeConfigService, businessTypes } from '../services/storeConfigService'
import { BusinessType } from '../types/database'
import { Store, Save, Plus, X } from 'lucide-react'

const StoreSettings: React.FC = () => {
  const { storeConfig, updateStoreConfig, loading } = useStoreConfig()
  const [formData, setFormData] = useState({
    store_name: '',
    business_type: '',
    categories: [] as string[],
    uses_sizes: false,
    size_options: [] as string[],
    custom_attributes: [] as { name: string; type: 'text' | 'number' | 'select'; options?: string[] }[],
    currency_symbol: '৳'
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'text' as 'text' | 'number' | 'select',
    options: [] as string[]
  })
  const [newAttributeOption, setNewAttributeOption] = useState('')

  useEffect(() => {
    if (storeConfig) {
      setFormData({
        store_name: storeConfig.store_name,
        business_type: storeConfig.business_type,
        categories: storeConfig.categories || [],
        uses_sizes: storeConfig.uses_sizes,
        size_options: storeConfig.size_options || [],
        custom_attributes: storeConfig.custom_attributes || [],
        currency_symbol: storeConfig.currency_symbol
      })
      const businessType = storeConfigService.getBusinessTypeById(storeConfig.business_type)
      setSelectedBusinessType(businessType || null)
    }
  }, [storeConfig])

  const handleBusinessTypeChange = (businessTypeId: string) => {
    const businessType = storeConfigService.getBusinessTypeById(businessTypeId)
    if (businessType) {
      setSelectedBusinessType(businessType)
      setFormData(prev => ({
        ...prev,
        business_type: businessTypeId,
        categories: businessType.default_categories,
        uses_sizes: businessType.uses_sizes,
        size_options: businessType.default_size_options,
        custom_attributes: businessType.suggested_attributes
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await updateStoreConfig(formData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving store config:', err)
      setError(err.message || 'Failed to save store configuration')
    } finally {
      setSaving(false)
    }
  }

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }))
      setNewCategory('')
    }
  }

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const addSize = () => {
    if (newSize.trim() && !formData.size_options.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        size_options: [...prev.size_options, newSize.trim()]
      }))
      setNewSize('')
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      size_options: prev.size_options.filter(s => s !== size)
    }))
  }

  const addAttribute = () => {
    if (newAttribute.name.trim()) {
      setFormData(prev => ({
        ...prev,
        custom_attributes: [...prev.custom_attributes, { ...newAttribute }]
      }))
      setNewAttribute({ name: '', type: 'text', options: [] })
    }
  }

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      custom_attributes: prev.custom_attributes.filter((_, i) => i !== index)
    }))
  }

  const addAttributeOption = () => {
    if (newAttributeOption.trim() && !newAttribute.options.includes(newAttributeOption.trim())) {
      setNewAttribute(prev => ({
        ...prev,
        options: [...prev.options, newAttributeOption.trim()]
      }))
      setNewAttributeOption('')
    }
  }

  const removeAttributeOption = (option: string) => {
    setNewAttribute(prev => ({
      ...prev,
      options: prev.options.filter(o => o !== option)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Loading store configuration...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <Store className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-600">Store configuration saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Store Information */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="store_name"
                  value={formData.store_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, store_name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., John's Electronics Store"
                />
              </div>

              <div>
                <label htmlFor="currency_symbol" className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  id="currency_symbol"
                  value={formData.currency_symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency_symbol: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $, €, ৳"
                />
              </div>
            </div>
          </div>

          {/* Business Type */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Type</h2>
            <div>
              <label htmlFor="business_type" className="block text-sm font-medium text-gray-700 mb-1">
                Select Business Type *
              </label>
              <select
                id="business_type"
                value={formData.business_type}
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose business type</option>
                {businessTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                This will set up default categories and attributes for your business type.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="border-b border-gray-200 pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add new category"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Size Options */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Size Options</h2>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.uses_sizes}
                  onChange={(e) => setFormData(prev => ({ ...prev, uses_sizes: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">This store uses sizes</span>
              </label>
            </div>
            {formData.uses_sizes && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add new size"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.size_options.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Attributes */}
          <div className="pb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Custom Product Attributes</h2>
            <div className="space-y-6">
              {/* Add New Attribute */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Attribute</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={newAttribute.name}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Attribute name (e.g., Color, Brand)"
                  />
                  <select
                    value={newAttribute.type}
                    onChange={(e) => setNewAttribute(prev => ({ ...prev, type: e.target.value as 'text' | 'number' | 'select' }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select Options</option>
                  </select>
                  <button
                    type="button"
                    onClick={addAttribute}
                    disabled={!newAttribute.name.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Attribute
                  </button>
                </div>

                {newAttribute.type === 'select' && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAttributeOption}
                        onChange={(e) => setNewAttributeOption(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add option"
                      />
                      <button
                        type="button"
                        onClick={addAttributeOption}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newAttribute.options.map((option) => (
                        <span
                          key={option}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                        >
                          {option}
                          <button
                            type="button"
                            onClick={() => removeAttributeOption(option)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Attributes */}
              {formData.custom_attributes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900">Current Attributes</h3>
                  {formData.custom_attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{attr.name}</span>
                        <span className="ml-2 text-sm text-gray-500">({attr.type})</span>
                        {attr.options && attr.options.length > 0 && (
                          <span className="ml-2 text-xs text-gray-400">
                            Options: {attr.options.join(', ')}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StoreSettings