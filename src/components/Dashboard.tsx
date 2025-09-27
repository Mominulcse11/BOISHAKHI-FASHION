import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react'
import DatabaseStatus from './DatabaseStatus'
import { salesService } from '../services/salesService'
import { productService } from '../services/productService'
import { DashboardStats, SalesChartData, Product } from '../types/database'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { requestNotificationPermission, showNotification } from '../lib/notifications'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todaysSales: 0,
    todaysProfit: 0,
    monthlySales: 0,
    monthlyProfit: 0,
    lowStockProducts: []
  })
  const [chartData, setChartData] = useState<SalesChartData[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Real-time sales subscription + notifications
  useEffect(() => {
    let isMounted = true
    requestNotificationPermission().catch(() => {})

    const channel = supabase
      .channel('realtime-sales')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sales' }, (payload: any) => {
        if (!isMounted) return
        // Update today's totals quickly (best-effort; full refresh still happens via Refresh button)
        setStats((prev) => ({
          ...prev,
          todaysSales: prev.todaysSales + (payload.new?.total_price || 0),
        }))
        // Optional toast/notification
        showNotification('New Sale!', {
          body: `৳${payload.new?.total_price || 0} sale completed`,
          tag: 'new-sale',
        })
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [
        todaysData,
        monthlyData,
        lowStockProducts,
        salesChartData,
        topSellingProducts
      ] = await Promise.all([
        salesService.getTodaysSales(),
        salesService.getMonthlySales(),
        productService.getLowStockProducts(),
        salesService.getLast30DaysSalesData(),
        salesService.getTopSellingProducts()
      ])

      setStats({
        todaysSales: todaysData.totalSales,
        todaysProfit: todaysData.totalProfit,
        monthlySales: monthlyData.totalSales,
        monthlyProfit: monthlyData.totalProfit,
        lowStockProducts
      })

      setChartData(salesChartData)
      setTopProducts(topSellingProducts)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Database Status */}
      <DatabaseStatus />
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">৳{stats.todaysSales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Profit</p>
              <p className="text-2xl font-bold text-gray-900">৳{stats.todaysProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
              <p className="text-2xl font-bold text-gray-900">৳{stats.monthlySales.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales & Profit (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                formatter={(value: number, name: string) => [
                  `৳${value.toFixed(2)}`,
                  name === 'sales' ? 'Sales' : 'Profit'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="sales"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                strokeWidth={2}
                name="profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products (This Month)</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.totalQuantity} sold</p>
                  <p className="text-sm text-gray-600">৳{product.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Warning */}
      {stats.lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-2" />
            <h2 className="text-lg font-semibold text-amber-800">Low Stock Warning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-lg border border-amber-200">
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category} - {product.size}</p>
                <p className="text-sm font-semibold text-amber-700">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard