import { supabase, isSupabaseConfigured } from './supabase'
import { Product, Purchase, Sale } from '../types/database'

// Mock data for when Supabase is not configured
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sari - Red Silk',
    category: 'Sari',
    size: 'Free Size',
    purchase_price: 1500,
    selling_price: 2200,
    stock: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Kurta - Cotton Blue',
    category: 'Kurta',
    size: 'L',
    purchase_price: 800,
    selling_price: 1200,
    stock: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockPurchases: Purchase[] = []
const mockSales: Sale[] = []

export class DatabaseManager {
  private static instance: DatabaseManager
  private initialized = false

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data for development')
      this.initialized = true
      return
    }

    try {
      console.log('Initializing database connection...')
      
      // Test database connection
      await this.testConnection()
      
      // Verify tables exist
      await this.verifyTables()
      
      this.initialized = true
      console.log('Database initialized successfully')
    } catch (error) {
      console.warn('Database initialization failed, falling back to mock data:', error)
      this.initialized = true
    }
  }

  private async testConnection(): Promise<void> {
    const { error } = await supabase.from('products').select('count').limit(1)
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
  }

  private async verifyTables(): Promise<void> {
    const tables = ['products', 'purchases', 'sales']
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        throw new Error(`Table '${table}' not found or inaccessible: ${error.message}`)
      }
    }
  }

  async getHealthStatus(): Promise<{
    connected: boolean
    tablesExist: boolean
    sampleDataExists: boolean
    error?: string
  }> {
    try {
      // Test connection
      await this.testConnection()
      
      // Check if tables exist and have data
      const { data: products } = await supabase.from('products').select('count')
      const { data: purchases } = await supabase.from('purchases').select('count')
      const { data: sales } = await supabase.from('sales').select('count')
      
      return {
        connected: true,
        tablesExist: true,
        sampleDataExists: (products?.length || 0) > 0
      }
    } catch (error: any) {
      return {
        connected: false,
        tablesExist: false,
        sampleDataExists: false,
        error: error.message
      }
    }
  }

  // Mock data methods
  getMockProducts(): Product[] {
    return [...mockProducts]
  }
  
  getMockPurchases(): Purchase[] {
    return [...mockPurchases]
  }
  
  getMockSales(): Sale[] {
    return [...mockSales]
  }
  
  isUsingMockData(): boolean {
    return !isSupabaseConfigured()
  }
}

export const dbManager = DatabaseManager.getInstance()
