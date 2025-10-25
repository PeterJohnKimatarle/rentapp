'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';
import SearchPopup from './SearchPopup';
import LoginPopup from './LoginPopup';
import RegistrationPopup from './RegistrationPopup';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Search, ArrowLeft, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogoClick = () => {
    // Force page reload to get fresh data
    window.location.href = '/';
  };

  const handleBackClick = () => {
    // Special handling for registration page - open login popup
    if (pathname === '/register') {
      setIsLoginPopupOpen(true);
      return;
    }
    
    // Use browser history for the listing page, services page, and new pages
    if (pathname === '/list-property' || pathname === '/services' || pathname === '/contact' || pathname === '/about' || pathname === '/profile') {
      // Check if there's history to go back to
      if (window.history.length > 1) {
        router.back();
      } else {
        // Fallback to home page if no history
        router.push('/');
      }
    } else {
      // For other pages, always go to home page
      router.push('/');
    }
  };

  const handleSearchClick = () => {
    setIsSearchPopupOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginPopupOpen(true);
  };

  const handleLoginPopupClose = () => {
    setIsLoginPopupOpen(false);
  };

  const handleRegistrationPopupClose = () => {
    setIsRegistrationPopupOpen(false);
  };

  const handleOpenRegistration = () => {
    setIsRegistrationPopupOpen(true);
  };

  const handleOpenLogin = () => {
    setIsLoginPopupOpen(true);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/my-properties':
        return 'My Properties';
      case '/bookmarks':
        return 'Bookmarks';
      case '/list-property':
        return 'Listing...';
      case '/services':
        return 'Our Services';
      case '/contact':
        return 'Contact Info';
      case '/about':
        return 'About Us';
      case '/profile':
        return 'Profile';
      case '/register':
        return 'Registration';
      case '/login':
        return 'Login';
      default:
        return 'Rentapp';
    }
  };

  const shouldShowBackButton = () => {
    return pathname !== '/';
  };

  // Prevent body scroll when any popup is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchPopupOpen || isLoginPopupOpen || isRegistrationPopupOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isMobileMenuOpen, isSearchPopupOpen, isLoginPopupOpen, isRegistrationPopupOpen]);

  // Listen for custom event to open login popup
  useEffect(() => {
    const handleOpenLoginPopup = () => {
      setIsLoginPopupOpen(true);
    };

    window.addEventListener('openLoginPopup', handleOpenLoginPopup);
    
    return () => {
      window.removeEventListener('openLoginPopup', handleOpenLoginPopup);
    };
  }, []);

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
          <button 
            onClick={handleSearchClick}
            className="p-2 text-gray-600 hover:text-booking-blue transition-colors cursor-pointer"
          >
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
        <div className="flex items-center gap-4">
          <div 
            onClick={handleSearchClick}
            className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Search size={20} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search for properties..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 cursor-pointer"
              readOnly
            />
          </div>
          
          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
                 <button
                   onClick={handleOpenLogin}
                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                 >
                   Login
                 </button>
            </div>
          )}
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
                className="absolute top-3 right-4 text-white transition-colors rounded-lg cursor-pointer h-10 w-10 flex items-center justify-center border border-white border-opacity-30"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              >
                <X size={20} />
              </button>
                     <Navigation variant="popup" onItemClick={() => setIsMobileMenuOpen(false)} onSearchClick={handleSearchClick} onLoginClick={handleOpenLogin} />
              
              {/* Second Close Button - Bottom */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-4 py-2 text-white rounded-lg font-medium transition-colors text-center"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
                  onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                  onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row min-w-0 pt-16">
        {/* Left Panel - Navigation (Desktop) */}
        <div className="hidden xl:block xl:w-64 xl:min-w-64 bg-white border-b xl:border-b-0 xl:border-r border-gray-200 flex-shrink-0 xl:fixed xl:top-16 xl:left-0 xl:overflow-y-auto xl:z-20" style={{ overflowAnchor: 'none', height: 'calc(100vh - 4rem)' }}>
          <Navigation onSearchClick={handleSearchClick} />
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 bg-gray-50 min-w-0 xl:ml-64 xl:mr-80">
          <main>
            {children}
          </main>
        </div>

        {/* Right Panel - Placeholder (Desktop) */}
        <div className="hidden xl:block xl:w-80 xl:min-w-80 bg-white border-l border-gray-200 flex-shrink-0 xl:fixed xl:top-16 xl:right-0 xl:overflow-y-auto xl:z-20 p-6" style={{ overflowAnchor: 'none', height: 'calc(100vh - 4rem)' }}>
          <div className="text-center text-gray-500">
            <h3 className="text-lg font-medium mb-4">Insights & Promotions</h3>
            <p className="text-sm">Coming soon...</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Search Popup */}
      <SearchPopup 
        isOpen={isSearchPopupOpen} 
        onClose={() => setIsSearchPopupOpen(false)} 
      />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={isLoginPopupOpen} 
        onClose={handleLoginPopupClose}
        onOpenRegistration={handleOpenRegistration}
      />

      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isRegistrationPopupOpen} 
        onClose={handleRegistrationPopupClose}
        onOpenLogin={handleOpenLogin}
      />
    </div>
  );
}
