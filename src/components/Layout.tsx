'use client';

import { ReactNode, useState } from 'react';
import NextImage from 'next/image';
import Navigation from './Navigation';
import Footer from './Footer';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-0">
          <NextImage src="/icon.png" alt="Rentapp Logo" width={32} height={32} />
          <h1 className="text-xl font-bold text-booking-blue">Rentapp</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-booking-blue transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 items-center justify-between bg-white border-b border-gray-200 px-6 py-3 z-30 shadow-sm">
        <div className="flex items-center gap-0">
          <NextImage src="/icon.png" alt="Rentapp Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-booking-blue">Rentapp</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-w-0 pt-12 lg:pt-16">
        {/* Left Panel - Navigation */}
        <div className={`w-full lg:w-64 lg:min-w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'} lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:overflow-y-auto lg:z-20`}>
          <Navigation />
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 bg-gray-50 min-w-0 lg:ml-64 lg:mr-80">
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Right Panel - Placeholder */}
        <div className="hidden lg:block w-80 min-w-80 bg-white border-l border-gray-200 flex-shrink-0 lg:fixed lg:top-16 lg:bottom-0 lg:right-0 lg:overflow-y-auto lg:z-20 p-6">
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
