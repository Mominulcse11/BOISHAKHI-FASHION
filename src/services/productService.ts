import { supabase } from '../lib/supabase'
import { dbManager } from '../lib/database'
import { Product } from '../types/database'

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    await dbManager.initialize()
    
    // Use mock data if Supabase is not configured
    if (dbManager.isUsingMockData()) {
      return dbManager.getMockProducts()
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return dbManager.getMockProducts()
      }
      return data || []
    } catch (error) {
      console.warn('Falling back to mock data:', error)
      return dbManager.getMockProducts()
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await dbManager.initialize()
    
    // Validate input data
    if (!product.name?.trim()) {
      throw new Error('Product name is required')
    }
    if (!product.category?.trim()) {
      throw new Error('Product category is required')
    }
    if (product.purchase_price < 0) {
      throw new Error('Purchase price cannot be negative')
    }
    if (product.selling_price < 0) {
      throw new Error('Selling price cannot be negative')
    }
    if (product.stock < 0) {
      throw new Error('Stock cannot be negative')
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error(`Failed to create product: ${error.message}`)
    }
    return data
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await dbManager.initialize()
    
    if (!id) {
      throw new Error('Product ID is required')
    }
    
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(`Failed to update product: ${error.message}`)
    }
    return data
  },

  async deleteProduct(id: string): Promise<void> {
    await dbManager.initialize()
    
    if (!id) {
      throw new Error('Product ID is required')
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  },

  async getLowStockProducts(threshold: number = 5): Promise<Product[]> {
    await dbManager.initialize()
    
    // Use mock data if Supabase is not configured
    if (dbManager.isUsingMockData()) {
      return dbManager.getMockProducts().filter(p => p.stock < threshold)
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lt('stock', threshold)
        .order('stock', { ascending: true })

      if (error) {
        console.error('Error fetching low stock products:', error)
        return dbManager.getMockProducts().filter(p => p.stock < threshold)
      }
      return data || []
    } catch (error) {
      console.warn('Falling back to mock data:', error)
      return dbManager.getMockProducts().filter(p => p.stock < threshold)
    }
  },

  async findByBarcode(barcode: string): Promise<Product | null> {
    await dbManager.initialize()
    const all = await this.getAllProducts()
    const found = all.find((p: any) => p?.custom_attributes?.barcode === barcode)
    return found || null
  }
}
