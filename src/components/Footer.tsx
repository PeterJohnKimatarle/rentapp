'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isGestureInfoOpen, setIsGestureInfoOpen] = useState(false);

  // Lock background scroll when gesture info popup is open
  useEffect(() => {
    if (isGestureInfoOpen) {
      // Store scroll position before locking
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [isGestureInfoOpen]);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-2 relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile: Original layout - only for very small devices (smartphones) */}
          <div className="lg:hidden">
            <p className="text-sm text-gray-600 text-center">© {currentYear} Rentapp Limited</p>
            <p className="text-sm text-gray-600 mt-0 text-center">All Rights Reserved.</p>
          </div>

          {/* Tablet and Desktop: Combined layout */}
          <div className="hidden lg:block text-center">
            <p className="text-sm text-gray-600">© {currentYear} Rentapp Limited - Tanzania&apos;s #1 Renting Platform</p>
            <p className="text-sm text-gray-600 mt-0.5">All Rights Reserved. Contact: 0755-123-500</p>
          </div>
        </div>

        {/* Info Icon - Positioned absolutely in the bottom right */}
        <button
          onClick={() => setIsGestureInfoOpen(true)}
          className="absolute bottom-2 right-4 p-2 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          aria-label="Gesture help"
        >
          <Info size={24} />
        </button>
      </footer>

      {/* Gesture Info Popup */}
      {isGestureInfoOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsGestureInfoOpen(false)}
        >
          <div 
            className="rounded-xl max-w-md w-full py-6 px-6 shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Swipe Gestures</h2>
              <button
                onClick={() => setIsGestureInfoOpen(false)}
                className="text-white transition-colors rounded-lg p-2 cursor-pointer"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Gesture Information - Simple and Clear */}
            <div className="space-y-3 text-white">
              {/* Navigation Menu */}
              <div className="bg-blue-600 bg-opacity-50 rounded-lg px-4 py-2">
                <div className="space-y-0">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-4xl text-yellow-300 flex-shrink-0">←</span>
                    <span className="text-base">Open menu (Swipe to the left)</span>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-4xl text-yellow-300 flex-shrink-0">→</span>
                    <span className="text-base">Close menu (Swipe to the right)</span>
                  </div>
                </div>
              </div>

              {/* Search Popup */}
              <div className="bg-blue-600 bg-opacity-50 rounded-lg px-4 py-2">
                <div className="space-y-0">
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-4xl text-yellow-300 flex-shrink-0">→</span>
                    <span className="text-base">Open search (Swipe to the right)</span>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-4xl text-yellow-300 flex-shrink-0">←</span>
                    <span className="text-base">Close search (Swipe to the left)</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-blue-100 text-center mt-4">
                💡 Gestures work across the app
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsGestureInfoOpen(false)}
              className="w-full mt-6 px-4 py-2 text-white rounded-lg font-medium transition-colors text-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}

