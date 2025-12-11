'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { startSession, updateSessionActivity, endSession, linkGuestSessionsToUser, getCurrentSession } from '@/utils/userTracking';

export default function UserTracking() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const sessionStartedRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start session on mount
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionStartedRef.current) return;
      
      const currentSession = getCurrentSession();
      
      // If there's an active session, don't start a new one
      if (currentSession && currentSession.isActive) {
        sessionStartedRef.current = true;
        return;
      }
      
      // Start new session
      try {
        await startSession(user?.id);
        sessionStartedRef.current = true;
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    initializeSession();

    // Set up activity tracking interval (update every 30 seconds)
    activityIntervalRef.current = setInterval(() => {
      const session = getCurrentSession();
      if (session && session.isActive && pathname) {
        updateSessionActivity(pathname);
      }
    }, 30000); // Update every 30 seconds

    // Cleanup on unmount
    return () => {
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
    };
  }, []); // Only run once on mount

  // Link guest sessions to user when they log in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      linkGuestSessionsToUser(user.id);
    }
  }, [isAuthenticated, user?.id]);

  // Track page views
  useEffect(() => {
    if (!sessionStartedRef.current || !pathname) return;
    
    // Skip if same path (e.g., hash changes)
    if (lastPathRef.current === pathname) return;
    
    lastPathRef.current = pathname;
    
    // Extract property ID from path if it's a property page
    const propertyMatch = pathname.match(/\/property\/([^/]+)/);
    const propertyId = propertyMatch ? propertyMatch[1] : undefined;
    
    updateSessionActivity(pathname, propertyId);
  }, [pathname]);

  // Track time spent and end session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden - update session but keep it active
        if (pathname) {
          updateSessionActivity(pathname);
        }
      } else {
        // Page is visible again - update activity
        if (pathname) {
          updateSessionActivity(pathname);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  // Update session when user changes
  useEffect(() => {
    if (sessionStartedRef.current && user?.id && pathname) {
      // User logged in - link guest sessions and update current session
      linkGuestSessionsToUser(user.id);
      updateSessionActivity(pathname);
    }
  }, [user?.id, pathname]);

  return null; // This component doesn't render anything
}

