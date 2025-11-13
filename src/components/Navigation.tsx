'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Settings, Phone, Info, PlusCircle, Heart, Building, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
  onHomeClick?: () => void;
}

export default function Navigation({ variant = 'default', onItemClick, onSearchClick, onLoginClick, onHomeClick }: NavigationProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  
  // Handle navigation item clicks in popup mode
  const handleNavClick = () => {
    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }
    if (onHomeClick) {
      onHomeClick();
    }
  };
  
  return (
    <nav className="p-4 lg:p-6">
      {/* Logo removed as requested */}

      {/* Navigation Links */}
      <div className={`space-y-2 lg:space-y-2 ${variant === 'popup' ? 'flex flex-col items-start space-y-2 pt-0 pb-0' : ''}`}>
        <Link 
          href="/" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-5/6 justify-start h-10 -mt-1 border border-white border-opacity-30 bg-blue-100' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Home size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Home</span>
        </Link>
        
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
            if (onSearchClick) {
              onSearchClick();
            }
          }}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Search size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Search</span>
        </a>
        
        <Link 
          href="/services" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/services' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Our Services</span>
        </Link>
        
        <Link 
          href="/contact" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/contact' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Phone size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Contact Info</span>
        </Link>
        
        <Link 
          href="/about" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/about' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Info size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">About Us</span>
        </Link>
        
        <Link 
          href="/list-property" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/list-property' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <PlusCircle size={20} className="flex-shrink-0" />
          <span className="text-base font-medium relative">
            List Your Property
            <span className="absolute bottom-0 left-0 right-0 h-px bg-current transform scale-x-105 origin-left -translate-x-0.75"></span>
          </span>
        </Link>
        
        <Link 
          href="/bookmarks" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/bookmarks' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Heart size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Bookmarks</span>
        </Link>
        
        <Link 
          href="/my-properties" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/my-properties' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Building size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">My Properties</span>
        </Link>
        
        <Link 
          href="/profile" 
          onClick={handleNavClick}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/profile' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <User size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Profile</span>
        </Link>

        {/* Authentication Section */}
        {!isAuthenticated && (
          <button
            onClick={() => {
              if (variant === 'popup' && onItemClick) {
                onItemClick();
              }
              if (onLoginClick) {
                onLoginClick();
              }
            }}
            className={`flex items-center space-x-3 ${
              variant === 'popup' 
                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'
            }`}
          >
            <LogIn size={20} className="flex-shrink-0" />
            <span className="text-base font-medium">Login</span>
          </button>
        )}
        
        {/* Close and Home Buttons - Only in popup mode */}
        {variant === 'popup' && (
          <div className="flex space-x-2 w-full">
            <button
              onClick={() => {
                if (onItemClick) {
                  onItemClick();
                }
                if (onHomeClick) {
                  onHomeClick();
                }
              }}
              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}
              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.8)'}
            >
              Home
            </button>
            <button
              onClick={() => {
                if (onItemClick) {
                  onItemClick();
                }
              }}
              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
            >
              Close
            </button>
          </div>
        )}
      </div>

    </nav>
  );
}
