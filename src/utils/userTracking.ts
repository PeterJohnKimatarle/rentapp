// User tracking utility
// Tracks: time spent, device/browser info, location, page views

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  browserVersion: string;
  os: string;
  timezone: string;
}

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  region?: string;
  accuracy?: number;
  timestamp: number;
}

export interface PageView {
  path: string;
  propertyId?: string;
  timestamp: number;
  timeSpent: number; // milliseconds
}

export interface UserSession {
  sessionId: string;
  userId?: string; // undefined for guests
  guestId?: string; // for guest users
  startTime: number;
  lastActivity: number;
  totalTimeSpent: number; // milliseconds
  deviceInfo: DeviceInfo;
  location?: LocationInfo;
  pageViews: PageView[];
  isActive: boolean;
}

const SESSIONS_STORAGE_KEY = 'rentapp_user_sessions';
const CURRENT_SESSION_KEY = 'rentapp_current_session';
const GUEST_ID_KEY = 'rentapp_guest_id';

// Generate unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate or get guest ID
export const getGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

// Detect device type
const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get browser info
const getBrowserInfo = (): { browser: string; version: string } => {
  if (typeof window === 'undefined') return { browser: 'Unknown', version: 'Unknown' };
  
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let version = 'Unknown';
  
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browser = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  } else if (ua.indexOf('Edg') > -1) {
    browser = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : 'Unknown';
  }
  
  return { browser, version };
};

// Get OS info
const getOSInfo = (): string => {
  if (typeof window === 'undefined') return 'Unknown';
  
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
  return 'Unknown';
};

// Get device info
export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      userAgent: '',
      platform: 'Unknown',
      language: 'en',
      screenWidth: 0,
      screenHeight: 0,
      deviceType: 'desktop',
      browser: 'Unknown',
      browserVersion: 'Unknown',
      os: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
    };
  }
  
  const { browser, version } = getBrowserInfo();
  const deviceType = detectDeviceType();
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform || 'Unknown',
    language: navigator.language || 'en',
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceType,
    browser,
    browserVersion: version,
    os: getOSInfo(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
  };
};

// Get location (requires user permission)
export const getLocation = (): Promise<LocationInfo | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        });
      },
      () => {
        // User denied or error - silently fail
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Get all sessions
const getAllSessions = (): UserSession[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading sessions:', error);
    return [];
  }
};

// Save all sessions
const saveAllSessions = (sessions: UserSession[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only last 1000 sessions to prevent storage bloat
    const limited = sessions.slice(-1000);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
};

// Get current session
export const getCurrentSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading current session:', error);
    return null;
  }
};

// Start a new session
export const startSession = async (userId?: string): Promise<UserSession> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot start session on server');
  }
  
  const sessionId = generateSessionId();
  const now = Date.now();
  const deviceInfo = getDeviceInfo();
  const location = await getLocation();
  const guestId = userId ? undefined : getGuestId();
  
  const session: UserSession = {
    sessionId,
    userId,
    guestId,
    startTime: now,
    lastActivity: now,
    totalTimeSpent: 0,
    deviceInfo,
    location: location || undefined,
    pageViews: [],
    isActive: true
  };
  
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  
  // Add to all sessions
  const allSessions = getAllSessions();
  allSessions.push(session);
  saveAllSessions(allSessions);
  
  return session;
};

// Update session activity
export const updateSessionActivity = (path: string, propertyId?: string): void => {
  if (typeof window === 'undefined') return;
  
  const session = getCurrentSession();
  if (!session || !session.isActive) return;
  
  const now = Date.now();
  const timeSinceLastActivity = now - session.lastActivity;
  
  // Update total time spent (only if less than 5 minutes since last activity - prevents counting idle time)
  if (timeSinceLastActivity < 300000) {
    session.totalTimeSpent += timeSinceLastActivity;
  }
  
  session.lastActivity = now;
  
  // Add page view
  const lastPageView = session.pageViews[session.pageViews.length - 1];
  if (lastPageView) {
    lastPageView.timeSpent = now - lastPageView.timestamp;
  }
  
  session.pageViews.push({
    path,
    propertyId,
    timestamp: now,
    timeSpent: 0
  });
  
  // Keep only last 100 page views per session
  if (session.pageViews.length > 100) {
    session.pageViews.shift();
  }
  
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  
  // Update in all sessions
  const allSessions = getAllSessions();
  const sessionIndex = allSessions.findIndex(s => s.sessionId === session.sessionId);
  if (sessionIndex !== -1) {
    allSessions[sessionIndex] = session;
    saveAllSessions(allSessions);
  }
};

// End current session
export const endSession = (): void => {
  if (typeof window === 'undefined') return;
  
  const session = getCurrentSession();
  if (!session) return;
  
  const now = Date.now();
  const timeSinceLastActivity = now - session.lastActivity;
  
  // Update final time spent
  if (timeSinceLastActivity < 300000) {
    session.totalTimeSpent += timeSinceLastActivity;
  }
  
  // Update last page view time spent
  const lastPageView = session.pageViews[session.pageViews.length - 1];
  if (lastPageView) {
    lastPageView.timeSpent = now - lastPageView.timestamp;
  }
  
  session.isActive = false;
  session.lastActivity = now;
  
  // Update in all sessions
  const allSessions = getAllSessions();
  const sessionIndex = allSessions.findIndex(s => s.sessionId === session.sessionId);
  if (sessionIndex !== -1) {
    allSessions[sessionIndex] = session;
    saveAllSessions(allSessions);
  }
  
  localStorage.removeItem(CURRENT_SESSION_KEY);
};

// Get sessions by user ID
export const getUserSessions = (userId: string): UserSession[] => {
  const allSessions = getAllSessions();
  return allSessions.filter(s => s.userId === userId);
};

// Get guest sessions
export const getGuestSessions = (guestId: string): UserSession[] => {
  const allSessions = getAllSessions();
  return allSessions.filter(s => s.guestId === guestId);
};

// Get all sessions (for admin)
export const getAllUserSessions = (): UserSession[] => {
  return getAllSessions();
};

// Format time spent (milliseconds to readable format)
export const formatTimeSpent = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

// Link guest sessions to user (when guest registers/logs in)
export const linkGuestSessionsToUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  const guestId = getGuestId();
  if (!guestId) return;
  
  const allSessions = getAllSessions();
  allSessions.forEach(session => {
    if (session.guestId === guestId && !session.userId) {
      session.userId = userId;
      session.guestId = undefined;
    }
  });
  
  saveAllSessions(allSessions);
};

