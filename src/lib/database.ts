import { supabase } from './supabase'

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

    try {
      console.log('Initializing database connection...')
      
      // Test database connection
      await this.testConnection()
      
      // Verify tables exist
      await this.verifyTables()
      
      this.initialized = true
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Database initialization failed:', error)
      throw new Error('Failed to initialize database. Please check your Supabase connection.')
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
}

export const dbManager = DatabaseManager.getInstance()