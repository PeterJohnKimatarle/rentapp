'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Settings, Phone, Info, PlusCircle, Bookmark, Building, User, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
}

export default function Navigation({ variant = 'default', onItemClick, onSearchClick, onLoginClick }: NavigationProps) {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="p-4 lg:p-6">
      {/* Logo removed as requested */}

      {/* Navigation Links */}
      <div className={`space-y-2 lg:space-y-2 ${variant === 'popup' ? 'flex flex-col items-start space-y-2 pt-0 pb-0' : ''}`}>
        <Link 
          href="/" 
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
              : pathname === '/bookmarks' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Bookmark size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Bookmarks</span>
        </Link>
        
        <Link 
          href="/my-properties" 
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
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
        {!isAuthenticated ? (
          <>
            {/* Login Button */}
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
                  ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
                  : 'text-gray-700 hover:text-black hover:bg-blue-500 hover:text-white rounded-lg px-3 py-2'
              }`}
            >
              <LogIn size={20} className="flex-shrink-0" />
              <span className="text-base font-medium">Login</span>
            </button>

            {/* Register Button */}
            <Link 
              href="/register" 
              onClick={() => {
                if (variant === 'popup' && onItemClick) {
                  onItemClick();
                }
              }}
              className={`flex items-center space-x-3 ${
                variant === 'popup' 
                  ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-green-500 hover:text-white w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
                  : 'text-gray-700 hover:text-black hover:bg-green-500 hover:text-white rounded-lg px-3 py-2'
              }`}
            >
              <UserPlus size={20} className="flex-shrink-0" />
              <span className="text-base font-medium">Register</span>
            </Link>
          </>
        ) : (
          /* Logout Button for authenticated users */
          <button
            onClick={() => {
              if (variant === 'popup' && onItemClick) {
                onItemClick();
              }
              logout();
            }}
            className={`flex items-center space-x-3 ${
              variant === 'popup' 
                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 
                : 'text-gray-700 hover:text-black hover:bg-red-500 hover:text-white rounded-lg px-3 py-2'
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="text-base font-medium">Logout</span>
          </button>
        )}
      </div>

    </nav>
  );
}
