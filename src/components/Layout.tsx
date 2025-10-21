'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import Navigation from './Navigation';
import Footer from './Footer';
import { Menu, X, Search } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    // Force page reload to get fresh data
    window.location.href = '/';
  };

  // Close menu when clicking outside and prevent body scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Mobile Header */}
      <div className="xl:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shadow-sm">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-0 cursor-pointer"
        >
          <NextImage src="/icon.png" alt="Rentapp Logo" width={32} height={32} />
          <h1 className="text-xl font-bold text-booking-blue">Rentapp</h1>
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:text-booking-blue transition-colors">
            <Search size={24} />
          </button>
                 <button
                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                   className="p-2 text-gray-600 hover:text-booking-blue transition-colors cursor-pointer"
                 >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden xl:flex fixed top-0 left-0 right-0 h-16 items-center justify-between bg-white border-b border-gray-200 px-6 z-30 shadow-sm">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-0 cursor-pointer"
        >
          <NextImage src="/icon.png" alt="Rentapp Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-booking-blue">Rentapp</h1>
        </button>
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80">
          <Search size={20} className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search for properties..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Mobile Menu Popup */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Popup Content */}
          <div
            ref={menuRef}
            className="absolute left-1/2 transform -translate-x-1/2 rounded-lg shadow-2xl max-w-72 w-full max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: '#0071c2', top: '14vh' }}
          >
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-2 right-2 text-white hover:text-white transition-colors border-2 border-white/80 hover:border-red-600 rounded-lg z-10 cursor-pointer h-10 w-10 flex items-center justify-center"
              >
                <X size={20} />
              </button>
              <Navigation variant="popup" onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row min-w-0 pt-16">
        {/* Left Panel - Navigation (Desktop) */}
        <div className="hidden xl:block xl:w-64 xl:min-w-64 bg-white border-b xl:border-b-0 xl:border-r border-gray-200 flex-shrink-0 xl:fixed xl:top-16 xl:left-0 xl:overflow-y-auto xl:z-20" style={{ overflowAnchor: 'none', height: 'calc(100vh - 4rem - 4rem)' }}>
          <Navigation />
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 bg-gray-50 min-w-0 xl:ml-64 xl:mr-80">
          <main className="p-2 sm:p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Right Panel - Placeholder (Desktop) */}
        <div className="hidden xl:block xl:w-80 xl:min-w-80 bg-white border-l border-gray-200 flex-shrink-0 xl:fixed xl:top-16 xl:right-0 xl:overflow-y-auto xl:z-20 p-6" style={{ overflowAnchor: 'none', height: 'calc(100vh - 4rem - 4rem)' }}>
          <div className="text-center text-gray-500">
            <h3 className="text-lg font-medium mb-4">Insights & Promotions</h3>
            <p className="text-sm">Coming soon...</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
