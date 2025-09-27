import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, ArrowRight, CheckCircle } from 'lucide-react'

const Welcome: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    'Inventory Management',
    'Sales Tracking',
    'Purchase Records',
    'Supplier Management',
    'Customizable Categories',
    'Real-time Analytics'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-amber-600 rounded-full">
              <Store className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
বিক্রেতা – স্মার্ট দোকান ব্যবস্থাপনা
          </h1>
          <p className="text-xl text-gray-600 mb-8">
সহজেই আপনার দোকান পরিচালনা করুন – বিক্রি, কেনা, স্টক, রিপোর্ট সব এক জায়গায়
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-amber-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Perfect for Any Business
            </h2>
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-amber-500">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Get Started in Minutes
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Configure Your Store</h3>
                  <p className="text-gray-600">Set your store name, business type, and product categories</p>
                </div>
              </div>
              <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Add Products</h3>
                  <p className="text-gray-600">Create your inventory with custom attributes</p>
                </div>
              </div>
              <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Start Managing</h3>
                  <p className="text-gray-600">Track sales, purchases, and grow your business</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/settings')}
              className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 flex items-center justify-center font-medium transition-colors"
            >
              Configure Your Store
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500">
            Already configured your store?{' '}
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Dashboard
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome