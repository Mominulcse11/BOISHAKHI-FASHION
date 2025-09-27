export interface Product {
  id: string
  user_id: string // Owner of the product
  name: string
  category: string
  size?: string // Optional - only for stores that need sizes
  purchase_price: number
  selling_price: number
  stock: number
  custom_attributes?: Record<string, any> // For flexible attributes like color, brand, etc.
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string // Owner of the purchase
  product_id: string
  supplier: string
  quantity: number
  purchase_price: number
  purchase_date: string
  products?: Product
}

export interface Sale {
  id: string
  user_id: string // Owner of the sale
  product_id: string
  quantity: number
  selling_price: number
  total_price: number
  sale_date: string
  products?: Product
}

export interface DashboardStats {
  todaysSales: number
  todaysProfit: number
  monthlySales: number
  monthlyProfit: number
  lowStockProducts: Product[]
}

export interface SalesChartData {
  date: string
  sales: number
  profit: number
}

export interface StoreConfig {
  id?: string
  user_id: string // Owner of the store
  store_name: string
  business_type: string
  categories: string[]
  uses_sizes: boolean
  size_options?: string[]
  custom_attributes?: { name: string; type: 'text' | 'number' | 'select'; options?: string[] }[]
  currency_symbol: string
  created_at?: string
  updated_at?: string
}

export interface BusinessType {
  id: string
  name: string
  default_categories: string[]
  uses_sizes: boolean
  default_size_options: string[]
  suggested_attributes: { name: string; type: 'text' | 'number' | 'select'; options?: string[] }[]
}
