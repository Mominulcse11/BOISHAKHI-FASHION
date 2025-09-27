import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { StoreConfig } from '../types/database'
import { storeConfigService } from '../services/storeConfigService'

interface StoreConfigContextType {
  storeConfig: StoreConfig | null
  loading: boolean
  updateStoreConfig: (config: Omit<StoreConfig, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  isConfigured: boolean
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined)

export const useStoreConfig = (): StoreConfigContextType => {
  const context = useContext(StoreConfigContext)
  if (context === undefined) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider')
  }
  return context
}

interface StoreConfigProviderProps {
  children: ReactNode
}

export const StoreConfigProvider: React.FC<StoreConfigProviderProps> = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStoreConfig = async () => {
    try {
      setLoading(true)
      const config = await storeConfigService.getStoreConfig()
      setStoreConfig(config)
    } catch (error) {
      console.error('Error loading store config:', error)
      // Set default config if none exists
      setStoreConfig({
        store_name: 'Universal Store',
        business_type: 'general',
        categories: ['General'],
        uses_sizes: false,
        currency_symbol: '৳'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateStoreConfig = async (config: Omit<StoreConfig, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedConfig = await storeConfigService.createOrUpdateStoreConfig(config)
      setStoreConfig(updatedConfig)
    } catch (error) {
      console.error('Error updating store config:', error)
      throw error
    }
  }

  useEffect(() => {
    loadStoreConfig()
  }, [])

  const isConfigured = storeConfig !== null && storeConfig.store_name !== 'Universal Store'

  const value = {
    storeConfig,
    loading,
    updateStoreConfig,
    isConfigured
  }

  return (
    <StoreConfigContext.Provider value={value}>
      {children}
    </StoreConfigContext.Provider>
  )
}