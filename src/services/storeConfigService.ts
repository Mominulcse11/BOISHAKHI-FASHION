import { supabase } from '../lib/supabase'
import { StoreConfig, BusinessType } from '../types/database'

// Predefined business types with their default configurations
export const businessTypes: BusinessType[] = [
  {
    id: 'clothing',
    name: 'Clothing Store',
    default_categories: ['Shirt', 'T-shirt', 'Pant', 'Jeans', 'Dress', 'Jacket', 'Skirt', 'Blouse'],
    uses_sizes: true,
    default_size_options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'],
    suggested_attributes: [
      { name: 'Color', type: 'select', options: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'] },
      { name: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim'] }
    ]
  },
  {
    id: 'food',
    name: 'Food Store / Restaurant',
    default_categories: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Snacks', 'Dairy', 'Fruits', 'Vegetables'],
    uses_sizes: false,
    default_size_options: [],
    suggested_attributes: [
      { name: 'Expiry Date', type: 'text' },
      { name: 'Weight/Volume', type: 'text' },
      { name: 'Brand', type: 'text' }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics Store',
    default_categories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Gaming', 'Audio', 'Smart Home', 'Cameras'],
    uses_sizes: false,
    default_size_options: [],
    suggested_attributes: [
      { name: 'Brand', type: 'select', options: ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Lenovo', 'Asus'] },
      { name: 'Model', type: 'text' },
      { name: 'Warranty (months)', type: 'number' }
    ]
  },
  {
    id: 'books',
    name: 'Book Store',
    default_categories: ['Fiction', 'Non-Fiction', 'Educational', 'Children', 'Comics', 'Biography', 'Science', 'History'],
    uses_sizes: false,
    default_size_options: [],
    suggested_attributes: [
      { name: 'Author', type: 'text' },
      { name: 'Publisher', type: 'text' },
      { name: 'ISBN', type: 'text' },
      { name: 'Pages', type: 'number' }
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    default_categories: ['Prescription', 'Over-the-Counter', 'Vitamins', 'First Aid', 'Personal Care', 'Baby Care'],
    uses_sizes: false,
    default_size_options: [],
    suggested_attributes: [
      { name: 'Dosage', type: 'text' },
      { name: 'Expiry Date', type: 'text' },
      { name: 'Manufacturer', type: 'text' },
      { name: 'Prescription Required', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  {
    id: 'general',
    name: 'General Store',
    default_categories: ['Household', 'Personal Care', 'Office Supplies', 'Tools', 'Toys', 'Gifts'],
    uses_sizes: false,
    default_size_options: [],
    suggested_attributes: [
      { name: 'Brand', type: 'text' },
      { name: 'Color', type: 'text' },
      { name: 'Material', type: 'text' }
    ]
  }
]

class StoreConfigService {
  async getStoreConfig(): Promise<StoreConfig | null> {
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data || null
    } catch (error) {
      console.error('Error fetching store config:', error)
      throw error
    }
  }

  async createOrUpdateStoreConfig(config: Omit<StoreConfig, 'id' | 'created_at' | 'updated_at'>): Promise<StoreConfig> {
    try {
      const existingConfig = await this.getStoreConfig()
      
      if (existingConfig) {
        const { data, error } = await supabase
          .from('store_config')
          .update({
            ...config,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('store_config')
          .insert({
            ...config,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    } catch (error) {
      console.error('Error saving store config:', error)
      throw error
    }
  }

  getBusinessTypeById(id: string): BusinessType | undefined {
    return businessTypes.find(type => type.id === id)
  }

  getBusinessTypes(): BusinessType[] {
    return businessTypes
  }
}

export const storeConfigService = new StoreConfigService()