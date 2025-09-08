import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { dbManager } from '../lib/database'
import { isSupabaseConfigured } from '../lib/supabase'

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    sampleDataExists: boolean
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setLoading(true)
    try {
      // Check if Supabase is configured first
      if (!isSupabaseConfigured()) {
        setStatus({
          connected: false,
          tablesExist: false,
          sampleDataExists: false,
          error: 'Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.'
        })
        return
      }
      
      const healthStatus = await dbManager.getHealthStatus()
      setStatus(healthStatus)
    } catch (error: any) {
      setStatus({
        connected: false,
        tablesExist: false,
        sampleDataExists: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-2" />
          <span className="text-blue-800">Checking database status...</span>
        </div>
      </div>
    )
  }

  if (!status) return null

  const isHealthy = status.connected && status.tablesExist

  return (
    <div className={`border rounded-lg p-4 ${
      isHealthy 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Database className={`h-5 w-5 mr-2 ${
            isHealthy ? 'text-green-600' : 'text-red-600'
          }`} />
          <span className={`font-medium ${
            isHealthy ? 'text-green-800' : 'text-red-800'
          }`}>
            Database Status
          </span>
        </div>
        <button
          onClick={checkStatus}
          className="p-1 rounded-md hover:bg-gray-100"
          title="Refresh status"
        >
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          {status.connected ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <span className={status.connected ? 'text-green-700' : 'text-red-700'}>
            Connection: {status.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex items-center">
          {status.tablesExist ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          )}
          <span className={status.tablesExist ? 'text-green-700' : 'text-red-700'}>
            Tables: {status.tablesExist ? 'Ready' : 'Missing'}
          </span>
        </div>

        <div className="flex items-center">
          {status.sampleDataExists ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
          )}
          <span className={status.sampleDataExists ? 'text-green-700' : 'text-amber-700'}>
            Sample Data: {status.sampleDataExists ? 'Available' : 'Empty'}
          </span>
        </div>
      </div>

      {status.error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
          <strong>Error:</strong> {status.error}
        </div>
      )}

      {!status.tablesExist && (
        <div className="mt-3 p-2 bg-amber-100 border border-amber-200 rounded text-sm text-amber-700">
          <strong>Setup Required:</strong> Please run the database migration to create required tables.
        </div>
      )}
    </div>
  )
}

export default DatabaseStatus