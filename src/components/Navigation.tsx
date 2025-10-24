'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Settings, Phone, Info, PlusCircle, Bookmark, Building, User } from 'lucide-react';

interface NavigationProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function Navigation({ variant = 'default', onItemClick }: NavigationProps) {
  const pathname = usePathname();
  
  return (
    <nav className="p-4 lg:p-6">
      {/* Logo removed as requested */}

      {/* Navigation Links */}
      <div className={`space-y-2 lg:space-y-2 ${variant === 'popup' ? 'flex flex-col items-start space-y-0 pt-0 pb-0 -space-y-1' : ''}`}>
        <Link 
          href="/" 
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-5/6 justify-start h-10 -mt-1' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Home size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Home</span>
        </Link>
        
        <a 
          href="#" 
          onClick={variant === 'popup' ? onItemClick : undefined}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Search size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Search</span>
        </a>
        
        <a 
          href="#" 
          onClick={variant === 'popup' ? onItemClick : undefined}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Our Services</span>
        </a>
        
        <a 
          href="#" 
          onClick={variant === 'popup' ? onItemClick : undefined}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Phone size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Contact Info</span>
        </a>
        
        <a 
          href="#" 
          onClick={variant === 'popup' ? onItemClick : undefined}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Info size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">About Us</span>
        </a>
        
        <Link 
          href="/list-property" 
          onClick={() => {
            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
          }}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
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
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
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
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : pathname === '/my-properties' 
                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 
                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <Building size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">My Properties</span>
        </Link>
        
        <a 
          href="#" 
          onClick={variant === 'popup' ? onItemClick : undefined}
          className={`flex items-center space-x-3 ${
            variant === 'popup' 
              ? 'text-white hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10' 
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'
          }`}
        >
          <User size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">Profile</span>
        </a>
      </div>

    </nav>
  );
}
