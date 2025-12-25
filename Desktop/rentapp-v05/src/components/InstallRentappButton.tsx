'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { createPortal } from 'react-dom';

interface InstallRentappButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function InstallRentappButton({ variant = 'default', onItemClick }: InstallRentappButtonProps) {
  const [isMobileBrowser, setIsMobileBrowser] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Check if running in mobile browser (not standalone)
  useEffect(() => {
    const checkMobileBrowser = () => {
      // Check if it's a mobile device
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
      const isIOS = /iphone|ipad/.test(navigator.userAgent.toLowerCase());

      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = isIOS && (window.navigator as any).standalone === true;

      // TEMP: Show on both mobile and desktop for testing
      const shouldShow = !isStandalone && !isIOSStandalone;

      console.log('InstallRentappButton - Device detection:', {
        userAgent: navigator.userAgent.toLowerCase(),
        isMobile,
        isIOS,
        isStandalone,
        isIOSStandalone,
        shouldShow,
        componentWillRender: shouldShow
      });

      setIsMobileBrowser(shouldShow);
    };

    checkMobileBrowser();
  }, []);

  const handleInstallClick = () => {
    console.log('Install Rentapp button clicked');
    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }
    console.log('Setting showInstallModal to true');
    setShowInstallModal(true);
  };

  const closeModal = () => {
    setShowInstallModal(false);
  };

  // Don't render if not mobile browser
  if (!isMobileBrowser) {
    console.log('InstallRentappButton - Not rendering (not mobile browser or in standalone mode)');
    return null;
  }

  console.log('InstallRentappButton - Rendering button');

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center space-x-3 ${
          variant === 'popup'
            ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer'
            : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'
        }`}
      >
        <Download size={20} className="flex-shrink-0" />
        <span className="text-base font-medium">Install Rentapp</span>
      </button>

      {/* Install Instructions Modal - Rendered via Portal */}
      {showInstallModal && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
            style={{
              touchAction: 'none',
              minHeight: '100vh',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            onClick={closeModal}
          >
          <div
            className="rounded-xl p-6 w-full max-w-sm shadow-2xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Install Rentapp</h3>
              <p className="text-gray-600 mt-2">Add Rentapp to your home screen</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Tap the browser menu</p>
                  <p className="text-gray-600 text-sm">(⋮ on Android Chrome, Share icon on iOS Safari)</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Select "Add to Home screen"</p>
                  <p className="text-gray-600 text-sm">or "Install app"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Confirm to add Rentapp</p>
                  <p className="text-gray-600 text-sm">to your home screen</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Open from home screen</p>
                  <p className="text-gray-600 text-sm">like a normal app</p>
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>,
          document.body
        )
      }
    </>
  );
}