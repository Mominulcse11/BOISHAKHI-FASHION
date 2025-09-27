import React from 'react';

const MobileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:hidden">
        <button className="p-2" aria-label="Open menu">☰</button>
        <h1 className="font-semibold">Store Manager</h1>
        <div aria-hidden className="w-6 h-6" />
      </header>
      <main className="pb-20 lg:pb-0">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
        <div className="flex items-center justify-around py-2">
          <button className="px-3 py-2">হোম</button>
          <button className="px-3 py-2">পণ্য</button>
          <button className="px-3 py-2">বিক্রয়</button>
          <button className="px-3 py-2">প্রোফাইল</button>
        </div>
      </nav>
    </div>
  );
};

export default MobileLayout;
