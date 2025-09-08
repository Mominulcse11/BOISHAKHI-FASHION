import { supabase } from '../lib/supabase'
import { dbManager } from '../lib/database'
import { Purchase } from '../types/database'

export const purchaseService = {
  async getAllPurchases(): Promise<Purchase[]> {
    await dbManager.initialize()
    
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products:product_id (
          name,
          category,
          size
        )
      `)
      .order('purchase_date', { ascending: false })

    if (error) {
      console.error('Error fetching purchases:', error)
      throw new Error(`Failed to fetch purchases: ${error.message}`)
    }
    return data || []
  },

  async createPurchase(purchase: Omit<Purchase, 'id' | 'purchase_date'>): Promise<Purchase> {
    await dbManager.initialize()
    
    // Validate input data
    if (!purchase.product_id) {
      throw new Error('Product ID is required')
    }
    if (!purchase.supplier?.trim()) {
      throw new Error('Supplier name is required')
    }
    if (purchase.quantity <= 0) {
      throw new Error('Quantity must be greater than 0')
    }
    if (purchase.purchase_price < 0) {
      throw new Error('Purchase price cannot be negative')
    }
    
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchase])
      .select()
      .single()

    if (error) {
      console.error('Error creating purchase:', error)
      throw new Error(`Failed to record purchase: ${error.message}`)
    }
    return data
  },

  async getPurchasesBySupplier(): Promise<{ supplier: string; totalAmount: number; totalQuantity: number }[]> {
    await dbManager.initialize()
    
    const { data, error } = await supabase
      .from('purchases')
      .select('supplier, quantity, purchase_price')

    if (error) {
      console.error('Error fetching purchases by supplier:', error)
      throw new Error(`Failed to fetch supplier data: ${error.message}`)
    }

    const supplierStats = (data || []).reduce((acc, purchase) => {
      if (!acc[purchase.supplier]) {
        acc[purchase.supplier] = { totalAmount: 0, totalQuantity: 0 }
      }
      acc[purchase.supplier].totalAmount += purchase.quantity * purchase.purchase_price
      acc[purchase.supplier].totalQuantity += purchase.quantity
      return acc
    }, {} as Record<string, { totalAmount: number; totalQuantity: number }>)

    return Object.entries(supplierStats).map(([supplier, stats]) => ({
      supplier,
      ...stats
    }))
  }
}