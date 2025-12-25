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
    console.log('Current state:', { showInstallModal, isMobileBrowser, variant });

    // TEMP: Add alert for mobile testing
    if (isMobileBrowser) {
      alert('Button clicked on mobile! Check console for logs.');
    }

    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }

    console.log('Setting showInstallModal to true');
    setShowInstallModal(true);

    // Visual debugging for mobile
    if (isMobileBrowser) {
      alert('Modal state set to: true\nNow checking if modal renders...');
    }

    // Force a re-render check
    setTimeout(() => {
      console.log('Modal state after timeout:', showInstallModal);
      if (isMobileBrowser && showInstallModal) {
        alert('Modal should be visible now. If you don\'t see it, there\'s a rendering issue.');
      }
    }, 500);
  };

  const closeModal = () => {
    console.log('Closing modal');
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

      {/* Install Instructions Modal */}
      {showInstallModal && (
        <>
          {console.log('Rendering modal, showInstallModal:', showInstallModal)}
          {/* Mobile: Render inline with highly visible styling */}
          <div
            className="fixed inset-0 z-[9999]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'red',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={(e) => {
              console.log('Mobile modal overlay clicked');
              closeModal();
            }}
          >
            <div
              className="w-full max-w-sm p-6 rounded-lg shadow-lg"
              style={{
                backgroundColor: 'yellow',
                border: '5px solid black',
                maxWidth: '300px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-black">📱 MOBILE MODAL TEST</h3>
                <p className="text-black font-bold">If you see this yellow box with red background,</p>
                <p className="text-black font-bold">the modal rendering works on mobile!</p>
              </div>
              <button
                onClick={closeModal}
                className="w-full py-3 font-bold text-lg"
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                CLOSE TEST MODAL
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}