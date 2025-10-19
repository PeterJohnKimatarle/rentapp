'use client';

import { Home, Search, Heart, User, Phone } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="p-4 lg:p-6">
      {/* Logo */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-booking-blue">Rentapp</h1>
        <p className="text-xs lg:text-sm text-gray-600 mt-1">Tanzania&apos;s #1 Renting Platform</p>
      </div>

      {/* Navigation Links */}
      <div className="space-y-3 lg:space-y-4">
        <a 
          href="#" 
          className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-booking-blue transition-colors"
        >
          <Home size={18} className="flex-shrink-0" />
          <span className="text-sm lg:text-base truncate">Home</span>
        </a>
        
        <a 
          href="#" 
          className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-booking-blue transition-colors"
        >
          <Search size={18} className="flex-shrink-0" />
          <span className="text-sm lg:text-base truncate">Search Properties</span>
        </a>
        
        <a 
          href="#" 
          className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-booking-blue transition-colors"
        >
          <Heart size={18} className="flex-shrink-0" />
          <span className="text-sm lg:text-base truncate">Saved Properties</span>
        </a>
        
        <a 
          href="#" 
          className="flex items-center space-x-2 lg:space-x-3 text-gray-700 hover:text-booking-blue transition-colors"
        >
          <User size={18} className="flex-shrink-0" />
          <span className="text-sm lg:text-base truncate">My Account</span>
        </a>
      </div>

    </nav>
  );
}
