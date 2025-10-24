'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import { Menu, X, Search, ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = () => {
    // Force page reload to get fresh data
    window.location.href = '/';
  };

  const handleBackClick = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home page if no history
      router.push('/');
    }
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/my-properties':
        return 'My Properties';
      case '/bookmarks':
        return 'Bookmarks';
      case '/list-property':
        return 'Listing...';
      default:
        return 'Rentapp';
    }
  };

  const shouldShowBackButton = () => {
    return pathname !== '/';
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Mobile Header */}
      <div className="xl:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 shadow-sm">
        {shouldShowBackButton() ? (
          <div className="flex items-center gap-1">
            <button 
              onClick={handleBackClick}
              className="cursor-pointer"
            >
              <ArrowLeft size={24} className="text-booking-blue" />
            </button>
            <button 
              onClick={handleBackClick}
              className="cursor-pointer"
            >
              <h1 className="text-xl font-bold text-booking-blue">{getPageTitle()}</h1>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-0 cursor-pointer"
          >
            <NextImage src="/icon.png" alt="Rentapp Logo" width={32} height={32} />
            <h1 className="text-xl font-bold text-booking-blue">Rentapp</h1>
          </button>
        )}
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
        <div 
          className="xl:hidden fixed inset-0 z-40"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Popup Content */}
          <div
            ref={menuRef}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-2xl max-w-72 w-full max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-2 right-2 text-white hover:text-white transition-colors border-2 border-white/80 hover:border-red-600 rounded-lg z-10 cursor-pointer h-10 w-10 flex items-center justify-center"
              >
                <X size={20} />
              </button>
              <Navigation variant="popup" onItemClick={() => setIsMobileMenuOpen(false)} />
              
              {/* Second Close Button - Bottom */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-white transition-colors rounded-lg py-2 cursor-pointer flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.8)'
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                  onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
                >
                  <X size={16} className="mr-1" />
                  <span className="text-sm font-medium" style={{ pointerEvents: 'none' }}>Close</span>
                </button>
              </div>
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
