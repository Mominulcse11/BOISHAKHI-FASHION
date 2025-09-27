import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { Home, ShoppingCart, TrendingUp, Settings, Bell, MessageCircle, Plus, Package, BarChart3 } from 'lucide-react';

const MobileLayout = ({ children }) => {
  const location = useLocation();
  const { storeConfig } = useStoreConfig();

  const navItems = [
    { to: '/dashboard', label: 'হোম', Icon: Home },
    { to: '/purchase', label: 'কেনা', Icon: ShoppingCart },
    { to: '/inventory', label: 'স্টক', Icon: Package },
    { to: '/settings', label: 'সেটিংস', Icon: Settings },
  ];

  const isActive = (to) => location.pathname.startsWith(to);

  const QuickActions = () => (
    <div className="-mt-8 px-4">
      <div className="grid grid-cols-2 gap-3">
        <Link to="/sale" className="rounded-xl p-4 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md active:scale-[0.99] transition">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="font-semibold">বিক্রি শুরু করুন</span>
          </div>
          <p className="text-xs text-white/90 mt-1">দ্রুত বিলিং</p>
        </Link>
        <Link to="/purchase" className="rounded-xl p-4 bg-white shadow-md border border-gray-100 active:scale-[0.99] transition">
          <div className="flex items-center text-gray-800">
            <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600" />
            <span className="font-semibold">কেনা যোগ করুন</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">সরবরাহকারীর বিল</p>
        </Link>
        <Link to="/add-product" className="rounded-xl p-4 bg-white shadow-md border border-gray-100 active:scale-[0.99] transition">
          <div className="flex items-center text-gray-800">
            <Plus className="w-5 h-5 mr-2 text-violet-600" />
            <span className="font-semibold">পণ্য যোগ</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">ছবি, সাইজ, স্টক</p>
        </Link>
        <Link to="/reports" className="rounded-xl p-4 bg-white shadow-md border border-gray-100 active:scale-[0.99] transition">
          <div className="flex items-center text-gray-800">
            <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
            <span className="font-semibold">রিপোর্ট</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">বিক্রি, লাভ, স্টক</p>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 lg:hidden relative">
      {/* Decorative gradient backdrop */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 opacity-95" />

      {/* Glass top bar */}
      <header className="relative px-4 pt-5 pb-16 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-bold text-lg drop-shadow-sm">
              {storeConfig?.store_name || 'Universal Store'}
            </h1>
            <p className="text-white/90 text-xs">বিক্রেতা — আপনার স্মার্ট দোকান সঙ্গী</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="Message" className="active:opacity-80">
              <MessageCircle className="w-5 h-5" />
            </a>
            <button aria-label="Notifications" className="active:opacity-80">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/settings" aria-label="Settings" className="active:opacity-80">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Quick actions on dashboard only */}
      {location.pathname === '/dashboard' && <QuickActions />}

      <main className="relative px-4 pb-28 -mt-6">
        {children}
      </main>

      {/* Floating Action Button for fast sale */}
      <Link
        to="/sale"
        aria-label="Start Sale"
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center active:scale-95"
      >
        <TrendingUp className="w-6 h-6" />
      </Link>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
        <div className="grid grid-cols-4">
          {navItems.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center py-2 text-xs"
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${isActive(to) ? 'text-amber-600' : 'text-gray-400'}`}
              />
              <span className={isActive(to) ? 'text-amber-700 font-medium' : 'text-gray-500'}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
