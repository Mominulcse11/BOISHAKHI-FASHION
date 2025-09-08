export interface Product {
  id: string
  name: string
  category: string
  size: string
  purchase_price: number
  selling_price: number
  stock: number
  created_at: string
  updated_at: string
}

export interface Purchase {
  id: string
  product_id: string
  supplier: string
  quantity: number
  purchase_price: number
  purchase_date: string
  products?: Product
}

export interface Sale {
  id: string
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