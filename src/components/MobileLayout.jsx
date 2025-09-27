import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStoreConfig } from '../contexts/StoreConfigContext';
import { Home, ShoppingCart, TrendingUp, Settings, Bell, MessageCircle } from 'lucide-react';

const MobileLayout = ({ children }) => {
  const location = useLocation();
  const { storeConfig } = useStoreConfig();

  const navItems = [
    { to: '/dashboard', label: 'হোম', Icon: Home },
    { to: '/sale', label: 'বিক্রি', Icon: TrendingUp },
    { to: '/purchase', label: 'কেনা', Icon: ShoppingCart },
    { to: '/settings', label: 'সেটিংস', Icon: Settings },
  ];

  const isActive = (to) => location.pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-gray-50 lg:hidden">
      {/* Top App Bar (original design, inspired by screenshots but distinct) */}
      <header className="px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="truncate font-bold text-lg">
              {storeConfig?.store_name || 'Universal Store'}
            </h1>
            <p className="text-white/90 text-xs">আপনার স্মার্ট দোকান সহায়ক</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="Message">
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

      <main className="pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm">
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
