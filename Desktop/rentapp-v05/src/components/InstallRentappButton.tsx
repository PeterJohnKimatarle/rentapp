'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface InstallRentappButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function InstallRentappButton({ variant = 'default', onItemClick }: InstallRentappButtonProps) {
  const [isAndroidMobile, setIsAndroidMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if device is Android mobile
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isNotIOS = !userAgent.includes('iphone') && !userAgent.includes('ipad');

    setIsAndroidMobile(isAndroid && isMobile && isNotIOS);
  }, []);

  // Check standalone mode and setup install prompt
  useEffect(() => {
    if (!isAndroidMobile) return;

    // Check if running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(standalone);
    };

    checkStandalone();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      setIsLoading(false); // Clear loading if it was set
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
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

    if (isStandalone) {
      // Already installed - do nothing
      return;
    }

    if (isInstalled) {
      // Open installed app
      window.open('/', '_blank');
    } else if (canInstall && deferredPrompt) {
      // Show install prompt
      setIsLoading(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setCanInstall(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.log('Install prompt failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Install prompt not ready yet - show loading and wait
      console.log('Install prompt not ready, waiting...');
      setIsLoading(true);

      // Wait a bit and try again, or the beforeinstallprompt event will trigger
      setTimeout(() => {
        setIsLoading(false);
        // If prompt became available during the wait, it will be handled by the event listener
      }, 2000);
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
    } else if (isLoading) {
      return { text: 'Loading...', disabled: true };
    } else if (canInstall) {
      return { text: 'Install Rentapp', disabled: false };
    } else {
      // Default to Install Rentapp if we can't determine the state yet
      return { text: 'Install Rentapp', disabled: false };
    }
  };

  const { text, disabled } = getButtonConfig();

  return (
    <button
      onClick={handleInstallClick}
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
  );
}
