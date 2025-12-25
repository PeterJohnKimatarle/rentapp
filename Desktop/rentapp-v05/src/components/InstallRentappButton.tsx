'use client';

import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';

interface InstallRentappButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function InstallRentappButton({ variant = 'default', onItemClick }: InstallRentappButtonProps) {
  const [isAndroidMobile, setIsAndroidMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasInstallPrompt, setHasInstallPrompt] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);

  // Use useRef to persistently store the deferred prompt
  const deferredPromptRef = useRef<any>(null);

  // Collect debug info
  const collectDebugInfo = () => {
    const info = {
      isAndroidMobile,
      isStandalone,
      hasInstallPrompt,
      isInstalled,
      deferredPromptAvailable: !!deferredPromptRef.current,
      installPromptSupported: 'onbeforeinstallprompt' in window,
      hasManifest: !!document.querySelector('link[rel="manifest"]'),
      hasServiceWorker: 'serviceWorker' in navigator,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    };
    return JSON.stringify(info, null, 2);
  };

  // Set up beforeinstallprompt listener once at startup
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 beforeinstallprompt event fired');
      // Prevent Chrome from auto-showing the prompt
      e.preventDefault();
      // Store the event persistently
      deferredPromptRef.current = e;
      setHasInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setIsInstalled(true);
      setHasInstallPrompt(false);
      deferredPromptRef.current = null;
    };

    // Listen for install prompt (optional - may not fire)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    // Listen for successful installation
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check if device is Android mobile
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isNotIOS = !userAgent.includes('iphone') && !userAgent.includes('ipad');

    const result = isAndroid && isMobile && isNotIOS;
    console.log('Device detection:', { userAgent, isAndroid, isMobile, isNotIOS, result });
    setIsAndroidMobile(result);
  }, []);

  // Check standalone mode and setup install prompt
  useEffect(() => {
    if (!isAndroidMobile) return;

    console.log('PWA setup: Android mobile detected, setting up PWA functionality');

    // Check if manifest is available
    const hasManifest = !!document.querySelector('link[rel="manifest"]');
    console.log('Manifest check:', { hasManifest });

    // Check service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('Service worker registrations:', registrations.length, registrations);
      });
    }

    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      console.log('Standalone check:', { standalone });
      setIsStandalone(standalone);
    };

    checkStandalone();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    // Check PWA capabilities for debugging
    const capabilities = {
      hasBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
      hasServiceWorker: 'serviceWorker' in navigator,
      hasManifest: !!document.querySelector('link[rel="manifest"]'),
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol
    };
    console.log('PWA capabilities:', capabilities);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 beforeinstallprompt event fired! Install prompt is now available.');
      e.preventDefault();
      deferredPromptRef.current = e;
      setHasInstallPrompt(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setIsInstalled(true);
      setHasInstallPrompt(false);
      deferredPromptRef.current = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', checkStandalone);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isAndroidMobile]);

  // Handle install button click
  const handleInstallClick = async () => {
    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }

    if (isInstalled) {
      // Open installed app
      window.open('/', '_blank');
      return;
    }

    if (hasInstallPrompt && deferredPromptRef.current) {
      // Show install prompt using the stored event
      deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      // Clear the stored prompt after use
      setHasInstallPrompt(false);
      deferredPromptRef.current = null;
    }
  };

  // Don't render if not Android mobile
  if (!isAndroidMobile) {
    return null;
  }

  // Determine button text and disabled state
  const getButtonConfig = () => {
    if (isStandalone) {
      return { text: 'App Installed', disabled: true };
    } else if (isInstalled) {
      return { text: 'Open in App', disabled: false };
    } else if (hasInstallPrompt) {
      return { text: 'Install Rentapp', disabled: false };
    } else if (isAndroidMobile) {
      // Android mobile but no install prompt available yet
      return { text: 'Install via browser menu', disabled: true };
    } else {
      // Not Android mobile - don't show button
      return null;
    }
  };

  const buttonConfig = getButtonConfig();

  // Don't render anything if not applicable
  if (!buttonConfig) {
    return null;
  }

  const { text, disabled } = buttonConfig;

  return (
    <>
      {showDebug && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" onClick={() => setShowDebug(false)}>
          <div className="bg-white rounded-lg p-4 max-w-md max-h-96 overflow-auto text-xs font-mono">
            <h3 className="font-bold mb-2">PWA Debug Info:</h3>
            <pre>{collectDebugInfo()}</pre>
          </div>
        </div>
      )}
      <button
        onClick={handleInstallClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowDebug(true);
        }}
        onTouchStart={() => {
          // Long press detection for mobile
          const timer = setTimeout(() => {
            setShowDebug(true);
          }, 1000);

          const clearTimer = () => clearTimeout(timer);
          document.addEventListener('touchend', clearTimer, { once: true });
        }}
        disabled={disabled}
        className={`flex items-center space-x-3 ${
        variant === 'popup'
          ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
      >
        <Download size={20} className="flex-shrink-0" />
        <span className="text-base font-medium">{text}</span>
      </button>
    </>
  );
}
