'use client';



import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';

import { Home, Search, Settings, Phone, Info, PlusCircle, Heart, Building, User, LogIn, ShieldCheck, LogOut, Download } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';

import { useState, useEffect } from 'react';



interface NavigationProps {

  variant?: 'default' | 'popup';

  onItemClick?: () => void;

  onSearchClick?: () => void;

  onLoginClick?: () => void;

  onLogoutClick?: () => void;

  onHomeClick?: () => void;

}



export default function Navigation({ variant = 'default', onItemClick, onSearchClick, onLoginClick, onLogoutClick, onHomeClick }: NavigationProps) {

  const pathname = usePathname();

  const router = useRouter();

  const { isAuthenticated, user, endSession, isImpersonating, logout } = useAuth();

  const isStaff = user?.role === 'staff';

  const isApprovedStaff = isStaff && user?.isApproved === true;

  const isAdmin = user?.role === 'admin';

  const [isEndingSession, setIsEndingSession] = useState(false);

  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isRunningStandalone, setIsRunningStandalone] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Debug function to manually clear installation flags
  const debugClearInstalled = () => {
    localStorage.removeItem('rentapp_pwa_installed');
    setIsAppInstalled(false);
    setIsRunningStandalone(false);
    console.log('Debug: Manually cleared PWA installation flags');
    setClickCount(0);
  };

  // Detect if PWA is installed
  useEffect(() => {
    console.log('🔍 PWA Detection: Starting installation check...');

    const checkIfInstalled = async () => {
      // Check if PWA was ever installed on this device/browser (stored in localStorage)
      const wasEverInstalled = localStorage.getItem('rentapp_pwa_installed') === 'true';

      // Check for active service worker (indicates PWA installation)
      let hasActiveServiceWorker = false;
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          // Check if we have registrations and if any are actually active
          if (registrations.length > 0) {
            // Try to find our specific service worker
            const rentappSW = registrations.find(reg =>
              reg.scope.includes('rentapp') ||
              reg.scope.includes(window.location.origin)
            );

            if (rentappSW) {
              // Check if the service worker is in an active state
              hasActiveServiceWorker = rentappSW.active !== null;

              // If service worker exists but isn't active, it might be uninstalling
              // Clear the localStorage flag to allow re-detection
              if (!hasActiveServiceWorker && wasEverInstalled) {
                console.log('Service worker found but not active - clearing installation flag');
                localStorage.removeItem('rentapp_pwa_installed');
              }
            }
          }
        }
      } catch (error) {
        console.log('Service worker check failed:', error);
        // If we can't check service workers, clear the flag to be safe
        if (wasEverInstalled) {
          localStorage.removeItem('rentapp_pwa_installed');
        }
      }

      // Also check current display mode for immediate detection
      const isCurrentlyStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      // Additional checks for installed PWA detection
      const isInstalledViaManifest = 'onbeforeinstallprompt' in window && 'onappinstalled' in window;
      const hasPWAFeatures = 'serviceWorker' in navigator && 'manifest' in document;

      // Aggressive cleanup: if no service workers at all, clear installation flag
      if (wasEverInstalled && !hasActiveServiceWorker && !isCurrentlyStandalone && !isInWebAppiOS) {
        console.log('🧹 Aggressive cleanup: No service workers or standalone mode detected, clearing installation flag');
        localStorage.removeItem('rentapp_pwa_installed');
        // Force re-evaluation
        setIsAppInstalled(false);
        setIsRunningStandalone(false);
      }

      // Get service worker count for logging
      let serviceWorkerCount = 0;
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          serviceWorkerCount = registrations.length;
        }
      } catch (error) {
        console.log('Error getting service worker count:', error);
      }

      console.log('PWA Detection Debug:', {
        wasEverInstalled,
        hasActiveServiceWorker,
        isCurrentlyStandalone,
        isInWebAppiOS,
        isInstalledViaManifest,
        hasPWAFeatures,
        serviceWorkerCount,
        displayMode: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      });

      console.log('📱 Final button state:', {
        isAppInstalled,
        isRunningStandalone,
        buttonText: isRunningStandalone ? 'App Installed' : isAppInstalled ? 'Open in App' : 'Install Rentapp'
      });

      // App is installed if: was ever installed OR has active service worker OR currently running standalone
      const isInstalled = wasEverInstalled || hasActiveServiceWorker || isCurrentlyStandalone || isInWebAppiOS;

      // Enhanced standalone detection for installed PWAs
      const isRunningAsInstalledPWA = isCurrentlyStandalone ||
                                     isInWebAppiOS ||
                                     (hasActiveServiceWorker && !window.location.search.includes('?')); // Additional heuristic

      // Track both states
      setIsAppInstalled(isInstalled);
      setIsRunningStandalone(isRunningAsInstalledPWA);
    };

    // Check immediately
    checkIfInstalled();

    // Run cleanup immediately on load
    const runImmediateCleanup = async () => {
      try {
        const storedFlag = localStorage.getItem('rentapp_pwa_installed');
        if (storedFlag === 'true') {
          let stillHasActiveSW = false;
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            stillHasActiveSW = registrations.length > 0;
          }

          if (!stillHasActiveSW) {
            console.log('Immediate cleanup: No service workers found, clearing installation flag');
            localStorage.removeItem('rentapp_pwa_installed');
            checkIfInstalled();
          }
        }
      } catch (error) {
        console.log('Immediate cleanup failed:', error);
      }
    };
    runImmediateCleanup();

    // Periodic cleanup check (every 10 seconds) to clear stale installation flags
    const cleanupInterval = setInterval(async () => {
      try {
        const storedFlag = localStorage.getItem('rentapp_pwa_installed');
        if (storedFlag === 'true') {
          // Re-check if service worker is still active
          let stillHasActiveSW = false;
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            const rentappSW = registrations.find(reg =>
              reg.scope.includes('rentapp') ||
              reg.scope.includes(window.location.origin)
            );
            stillHasActiveSW = rentappSW ? rentappSW.active !== null : false;
          }

          // If no active service worker but flag is set, clear it
          if (!stillHasActiveSW) {
            console.log('Periodic cleanup: Clearing stale installation flag');
            localStorage.removeItem('rentapp_pwa_installed');
            checkIfInstalled(); // Re-check installation status
          }
        }
      } catch (error) {
        console.log('Periodic cleanup failed:', error);
      }
    }, 30000); // Check every 30 seconds

    // Listen for app installation event
    const handleAppInstalled = () => {
      console.log('PWA installed event fired!');
      // Store installation flag in localStorage for future detection
      localStorage.setItem('rentapp_pwa_installed', 'true');
      setIsAppInstalled(true);
    };

    // Listen for beforeinstallprompt to know when installation becomes available
    const handleBeforeInstallPrompt = () => {
      // If beforeinstallprompt fires, it means the app is not yet installed
      // But we don't change state here as the user might choose not to install
      console.log('PWA install prompt available');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      checkIfInstalled();
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleEndSession = async () => {

    setIsEndingSession(true);

    try {

      await endSession();

    } catch (error) {

      console.error('Error ending session:', error);

    } finally {

      setIsEndingSession(false);

    }

  };



  const handleNavClick = () => {

    if (variant === 'popup' && onItemClick) {

      onItemClick();

    }

    if (onHomeClick) {

      onHomeClick();

    }

  };



  return (

    <nav className="p-4 lg:p-6">

      {/* Logo removed as requested */}



      {/* Navigation Links */}

      <div className={`space-y-2 lg:space-y-2 ${variant === 'popup' ? 'flex flex-col items-start space-y-2 pt-0 pb-0' : ''}`}>

        <Link 

          href="/" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Home size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Home</span>

        </Link>



        <a 

          href="#" 

          onClick={(e) => {

            e.preventDefault();

            if (variant === 'popup' && onItemClick) {

              onItemClick();

            }

            if (onSearchClick) {

              onSearchClick();

            }

          }}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Search size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Search</span>

        </a>

        

        <Link 

          href="/services" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/services' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Settings size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Our Services</span>

        </Link>

        

        <Link 

          href="/contact" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/contact' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Phone size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Contact Info</span>

        </Link>

        

        <Link 

          href="/about" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/about' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Info size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">About Us</span>

        </Link>

        

        <Link 

          href="/list-property" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

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

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/bookmarks' || pathname === '/recently-removed-bookmarks'

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Heart size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Bookmarks</span>

        </Link>



        <Link 

          href="/my-properties" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/my-properties' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <Building size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">My Properties</span>

        </Link>



        {isApprovedStaff && (

          <Link 

            href="/staff" 

            onClick={handleNavClick}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

                : pathname === '/staff' 

                  ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                  : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

            }`}

          >

            <ShieldCheck size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Staff Portal</span>

          </Link>

        )}



        {isAdmin && (

          <Link 

            href="/admin" 

            onClick={handleNavClick}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? pathname === '/admin'
                  ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100'
                  : 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

                : pathname === '/admin' 

                  ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                  : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

            }`}

          >

            <ShieldCheck size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Admin Portal</span>

          </Link>

        )}



        {isImpersonating && (

          <button

            onClick={() => {

              if (variant === 'popup' && onItemClick) {

                onItemClick();

              }

              handleEndSession();

            }}

            disabled={isEndingSession}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed' 

                : 'text-red-600 hover:text-red-700 hover:bg-yellow-500 rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed'

            }`}

          >

            <LogOut size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">{isEndingSession ? 'Ending...' : 'End Session'}</span>

          </button>

        )}

        

        <Link 

          href="/profile" 

          onClick={handleNavClick}

          className={`flex items-center space-x-3 ${

            variant === 'popup' 

              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100' 

              : pathname === '/profile' 

                ? 'text-gray-700 bg-green-200 rounded-lg px-3 py-2' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2'

          }`}

        >

          <User size={20} className="flex-shrink-0" />

          <span className="text-base font-medium">Profile</span>

        </Link>



        {/* Authentication Section */}

        {!isAuthenticated && (

          <button

            onClick={() => {

              if (variant === 'popup' && onItemClick) {

                onItemClick();

              }

              if (onLoginClick) {

                onLoginClick();

              }

            }}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'

            }`}

          >

            <LogIn size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Login/Register</span>

          </button>

        )}

        {isAuthenticated && (

          <button

            onClick={() => {

              if (onLogoutClick) {

                onLogoutClick();

              } else {

                // Fallback to direct logout if no handler provided

                if (variant === 'popup' && onItemClick) {

                  onItemClick();

                }

                const wasAdmin = isAdmin;

                logout();

                if (wasAdmin) {

                  router.push('/');

                }

              }

            }}

            className={`flex items-center space-x-3 ${

              variant === 'popup' 

                ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer' 

                : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'

            }`}

          >

            <LogOut size={20} className="flex-shrink-0" />

            <span className="text-base font-medium">Logout</span>

          </button>

        )}

        {/* Install Rentapp Button */}
        <button
          onClick={() => {
            // Triple-click debug: clear installation flags
            setClickCount(prev => {
              const newCount = prev + 1;
              if (newCount === 3) {
                debugClearInstalled();
                return 0;
              }
              // Reset count after 2 seconds
              setTimeout(() => setClickCount(0), 2000);
              return newCount;
            });

            if (variant === 'popup' && onItemClick) {
              onItemClick();
            }
            if (isAppInstalled) {
              // Open in app - could redirect to app URL or handle differently
              console.log('Open in app clicked');
            } else {
              // Install functionality here
              console.log('Install Rentapp clicked');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (variant === 'popup' && onItemClick) {
                onItemClick();
              }
              if (isAppInstalled) {
                console.log('Open in app clicked');
              } else {
                console.log('Install Rentapp clicked');
              }
            }
          }}
          className={`flex items-center space-x-3 ${
            variant === 'popup'
              ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer'
              : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'
          }`}
        >
          <Download size={20} className="flex-shrink-0" />
          <span className="text-base font-medium">
            {isRunningStandalone ? 'App Installed' : isAppInstalled ? 'Open in App' : 'Install Rentapp'}
          </span>
        </button>


        {/* Close and Home Buttons - Only in popup mode */}

        {variant === 'popup' && (

          <div className="flex space-x-2 w-full">

            <button

              onClick={() => {

                if (onItemClick) {

                  onItemClick();

                }

                if (onHomeClick) {

                  onHomeClick();

                }

              }}

              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"

              style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}

              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}

              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.8)'}

            >

              Home

            </button>

            <button

              onClick={() => {

                if (onItemClick) {

                  onItemClick();

                }

              }}

              className="text-white px-4 py-2 rounded-lg font-medium transition-colors text-center h-10 cursor-pointer flex-1"

              style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}

              onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}

              onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}

            >

              Close

            </button>

          </div>

        )}

      </div>



    </nav>

  );

}

