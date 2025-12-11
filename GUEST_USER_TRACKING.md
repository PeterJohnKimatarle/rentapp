# Guest User Tracking Implementation Guide

## Overview
There are several ways to track guest users (unauthenticated visitors) in your app. Here are practical approaches:

## Option 1: Guest Session ID (Recommended)
**How it works:**
- Generate a unique guest ID on first visit
- Store in localStorage/sessionStorage
- Track activities associated with this ID
- When guest registers, link their guest data to their new account

**Pros:**
- Simple to implement
- Persistent across sessions (localStorage) or per session (sessionStorage)
- Can link guest activity to registered account later

**Cons:**
- Can be cleared by user
- Multiple devices = multiple guest IDs

## Option 2: Browser Fingerprinting
**How it works:**
- Create a unique fingerprint based on browser/device characteristics
- Screen resolution, timezone, language, installed fonts, etc.
- More persistent than cookies/localStorage

**Pros:**
- Harder to clear
- Works across incognito mode
- More persistent tracking

**Cons:**
- Privacy concerns
- Can change with browser updates
- More complex to implement

## Option 3: Hybrid Approach (Best)
**How it works:**
- Use guest session ID as primary
- Fallback to browser fingerprint if ID missing
- Combine both for better accuracy

## Implementation Suggestions

### What to Track:
1. **Properties Viewed** - Which properties guest browsed
2. **Bookmarks** - Properties guest bookmarked (before login)
3. **Search Queries** - What they searched for
4. **Time Spent** - How long on each property/page
5. **Referral Source** - Where they came from
6. **Device Info** - Mobile/Desktop, browser type
7. **Location** - If available (IP-based or geolocation)

### Storage Options:
1. **localStorage** - Persistent, survives browser restarts
2. **sessionStorage** - Per-session only, cleared on close
3. **IndexedDB** - For larger datasets
4. **Backend API** - If you have a backend (most reliable)

## Recommended Implementation

### Step 1: Create Guest ID Utility
```typescript
// src/utils/guestTracking.ts
export const getGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let guestId = localStorage.getItem('rentapp_guest_id');
  
  if (!guestId) {
    // Generate unique ID
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('rentapp_guest_id', guestId);
    
    // Track first visit
    trackGuestEvent('first_visit', { guestId });
  }
  
  return guestId;
};

export const trackGuestEvent = (event: string, data?: any) => {
  const guestId = getGuestId();
  const timestamp = Date.now();
  
  // Store in localStorage
  const events = JSON.parse(localStorage.getItem('rentapp_guest_events') || '[]');
  events.push({ guestId, event, data, timestamp });
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.shift();
  }
  
  localStorage.setItem('rentapp_guest_events', JSON.stringify(events));
  
  // Optional: Send to analytics/backend
  // sendToAnalytics({ guestId, event, data, timestamp });
};
```

### Step 2: Track Property Views
```typescript
// In PropertyCard or property details page
useEffect(() => {
  if (!isAuthenticated && property?.id) {
    trackGuestEvent('property_viewed', {
      propertyId: property.id,
      propertyTitle: property.title,
      timestamp: Date.now()
    });
  }
}, [property?.id, isAuthenticated]);
```

### Step 3: Link Guest Data on Registration
```typescript
// In AuthContext after successful registration
const linkGuestDataToUser = (userId: string) => {
  const guestId = getGuestId();
  const guestEvents = JSON.parse(localStorage.getItem('rentapp_guest_events') || '[]');
  
  // Link guest events to new user
  guestEvents.forEach(event => {
    // Store with user ID
    localStorage.setItem(`rentapp_user_${userId}_guest_events`, JSON.stringify(guestEvents));
  });
  
  // Clear guest ID (optional - or keep for analytics)
  // localStorage.removeItem('rentapp_guest_id');
};
```

## Privacy Considerations
- **GDPR Compliance**: Inform users about tracking
- **Opt-out Option**: Allow users to disable tracking
- **Data Retention**: Set expiration for guest data
- **Anonymization**: Don't store PII for guests

## Analytics Integration
You can integrate with:
- **Google Analytics** - Track page views, events
- **Mixpanel** - User behavior tracking
- **Amplitude** - Product analytics
- **Custom Backend** - Your own analytics system

## Example: Track Guest Bookmarks
```typescript
// When guest bookmarks a property
if (!isAuthenticated) {
  const guestId = getGuestId();
  trackGuestEvent('property_bookmarked', {
    propertyId: property.id,
    guestId
  });
  
  // Store in guest bookmarks
  const guestBookmarks = JSON.parse(
    localStorage.getItem(`rentapp_guest_bookmarks_${guestId}`) || '[]'
  );
  if (!guestBookmarks.includes(property.id)) {
    guestBookmarks.push(property.id);
    localStorage.setItem(
      `rentapp_guest_bookmarks_${guestId}`,
      JSON.stringify(guestBookmarks)
    );
  }
}
```

## Next Steps
1. Decide what data to track
2. Choose storage method (localStorage recommended for start)
3. Implement guest ID generation
4. Add tracking hooks in key components
5. Create admin view to see guest analytics (optional)

