'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isGestureInfoOpen, setIsGestureInfoOpen] = useState(false);

  // Lock background scroll when gesture info popup is open
  usePreventScroll(isGestureInfoOpen);

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
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            className="rounded-xl max-w-72 w-full py-6 px-6 shadow-2xl overflow-hidden"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white xl:hidden">Swipe Gestures</h2>
              <h2 className="text-2xl font-bold text-white hidden xl:block">Navigation Guide</h2>
            </div>

            {/* Mobile: Gesture Information */}
            <div className="space-y-3 text-white xl:hidden">
              {/* Navigation Menu */}
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0 leading-none" style={{ color: '#fbbf24' }}>←</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Open menu</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Swipe to the left</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0 leading-none" style={{ color: '#fbbf24' }}>→</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Close menu</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Swipe to the right</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Popup */}
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0 leading-none" style={{ color: '#fbbf24' }}>→</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Open search</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Swipe to the right</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-4xl flex-shrink-0 leading-none" style={{ color: '#fbbf24' }}>←</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Close search</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Swipe to the left</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-center mt-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                💡 Gestures work across the app
              </p>
            </div>

            {/* Desktop: Navigation Information */}
            <div className="space-y-3 text-white hidden xl:block">
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" style={{ color: '#fbbf24' }}>☰</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Navigation Menu</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Click the menu icon in the header</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" style={{ color: '#fbbf24' }}>🔍</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">Search Properties</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Click the search icon or search bar</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" style={{ color: '#fbbf24' }}>👤</span>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-white">User Profile</div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Click your avatar to access your profile</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-center mt-4" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                💡 All features are accessible via the navigation panel
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
            <button
              onClick={() => setIsGestureInfoOpen(false)}
                className="w-2/3 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Ok, I got it
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

