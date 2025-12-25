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

      // Only show if mobile AND not standalone
      const shouldShow = isMobile && !isStandalone && !isIOSStandalone;

      console.log('InstallRentappButton - Device detection:', {
        userAgent: navigator.userAgent.toLowerCase(),
        isMobile,
        isIOS,
        isStandalone,
        isIOSStandalone,
        shouldShow,
        componentWillRender: shouldShow
      });

      // Remove the mobile alert since we only want mobile-specific debugging now
      if (isMobileBrowser) {
        // Keep mobile-specific alerts for testing
      }

      setIsMobileBrowser(shouldShow);
    };

    checkMobileBrowser();
  }, []);

  const handleInstallClick = () => {
    console.log('Install Rentapp button clicked');
    console.log('Current state:', { showInstallModal, isMobileBrowser, variant });

    // Debug alert for mobile testing
    if (isMobileBrowser) {
      alert('Button clicked on mobile! Check for test modals.');
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
      {(() => {
        console.log('Modal conditional check - showInstallModal:', showInstallModal, 'isMobileBrowser:', isMobileBrowser);

        if (showInstallModal) {
          console.log('🎯 EXECUTING MODAL RENDER CODE');

          // Force DOM manipulation for mobile testing
          if (isMobileBrowser && typeof document !== 'undefined') {
            console.log('Creating mobile test element...');
            const testDiv = document.createElement('div');
            testDiv.innerHTML = `
              <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: red;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                font-weight: bold;
              ">
                <div style="
                  background: yellow;
                  padding: 20px;
                  border: 5px solid black;
                  max-width: 300px;
                  text-align: center;
                ">
                  📱 FORCE DOM MODAL<br>
                  If you see this, DOM manipulation works!<br>
                  <button style="
                    background: black;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin-top: 10px;
                    font-size: 18px;
                    cursor: pointer;
                  " onclick="this.parentElement.parentElement.remove()">CLOSE</button>
                </div>
              </div>
            `;
            document.body.appendChild(testDiv);
            console.log('Force DOM element added to body');

            // Also try the React approach
            return (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'blue',
                  zIndex: 99998,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
                onClick={(e) => {
                  console.log('React modal overlay clicked');
                  closeModal();
                }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    border: '5px solid green',
                    padding: '20px',
                    maxWidth: '300px',
                    textAlign: 'center'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 style={{ color: 'black', fontSize: '24px' }}>⚛️ REACT MODAL TEST</h3>
                  <p style={{ color: 'black', fontWeight: 'bold' }}>
                    If you see this white box with blue background,
                    React rendering works on mobile!
                  </p>
                  <button
                    onClick={closeModal}
                    style={{
                      backgroundColor: 'green',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      marginTop: '10px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    CLOSE REACT MODAL
                  </button>
                </div>
              </div>
            );
          }

          return null;
        }

        return null;
      })()}
    </>
  );
}