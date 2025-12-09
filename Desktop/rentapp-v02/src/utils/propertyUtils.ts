import { properties as staticProperties } from '@/data/properties';

// Cache for getAllProperties to improve performance
let propertiesCache: DisplayProperty[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 100; // 100ms cache to batch rapid calls

// Interface for properties saved from the form (localStorage)
export interface PropertyFormData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  status: string;
  region: string;
  ward: string;
  price: string;
  paymentPlan: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  amenities: string[];
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  uploaderType?: 'Broker' | 'Owner';
  createdAt: string;
  updatedAt?: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
}

// Combined property interface for display
export interface DisplayProperty {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  plan: '3+' | '6+' | '12+';
  updatedAt: string;
  status: 'available' | 'occupied';
  // Additional fields from form
  propertyType?: string;
  region?: string;
  ward?: string;
  amenities?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  uploaderType?: 'Broker' | 'Owner';
  createdAt?: string;
  ownerId?: string;
  ownerEmail?: string;
  ownerName?: string;
}

// Convert form data to display format
export const convertFormDataToDisplayProperty = (formData: PropertyFormData): DisplayProperty => {
  // Generate title from property type only
  const title = formData.title || formData.propertyType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  // Generate description from property details
  const description = formData.description || `A ${formData.propertyType.replace(/-/g, ' ')} located in ${formData.ward.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}, ${formData.region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}.`;

  // Extract bedrooms and bathrooms from property type if not provided
  const bedrooms = formData.bedrooms ? parseInt(formData.bedrooms) : 
    (formData.propertyType.includes('1-bdrm') ? 1 :
     formData.propertyType.includes('2-bdrm') ? 2 :
     formData.propertyType.includes('3-bdrm') ? 3 :
     formData.propertyType.includes('4-bdrm') ? 4 :
     formData.propertyType.includes('5-bdrm') ? 5 : 2);

  const bathrooms = formData.bathrooms ? parseInt(formData.bathrooms) : 
    (bedrooms === 1 ? 1 : bedrooms === 2 ? 2 : bedrooms >= 3 ? 2 : 1);

  return {
    id: formData.id,
    title: title,
    location: `${formData.ward.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}, ${formData.region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    description: description,
    price: parseInt(formData.price.replace(/,/g, '')),
    images: formData.images,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    area: parseInt(formData.squareFootage) || 0,
    plan: formData.paymentPlan as '3+' | '6+' | '12+',
    updatedAt: formData.updatedAt || formData.createdAt,
    status: formData.status as 'available' | 'occupied',
    propertyType: formData.propertyType,
    region: formData.region,
    ward: formData.ward,
    amenities: formData.amenities,
    contactName: formData.contactName,
    contactPhone: formData.contactPhone,
    contactEmail: formData.contactEmail,
    uploaderType: formData.uploaderType,
    createdAt: formData.createdAt,
    ownerId: formData.ownerId,
    ownerEmail: formData.ownerEmail,
    ownerName: formData.ownerName
  };
};

// Invalidate the properties cache (call this when properties are added/updated/deleted)
export const invalidatePropertiesCache = () => {
  propertiesCache = null;
  cacheTimestamp = 0;
};

// Get all properties (static + localStorage)
export const getAllProperties = (): DisplayProperty[] => {
  const now = Date.now();
  
  // Return cached result if available and fresh
  if (propertiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return propertiesCache;
  }

  // Get static properties (this is fast, no need to cache)
  const staticProps: DisplayProperty[] = staticProperties.map(prop => ({
    ...prop,
    plan: prop.plan as '3+' | '6+' | '12+'
  }));

  // Get localStorage properties (only in browser environment)
  const localStorageProperties: PropertyFormData[] = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('rentapp_properties') || '[]')
    : [];

  // Convert localStorage properties to display format
  const convertedProperties: DisplayProperty[] = localStorageProperties.map(convertFormDataToDisplayProperty);

  // Combine and sort by creation date (newest first)
  const allProperties = [...convertedProperties, ...staticProps];
  
  const sortedProperties = allProperties.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || '');
    const dateB = new Date(b.updatedAt || b.createdAt || '');
    return dateB.getTime() - dateA.getTime();
  });

  // Cache the result
  propertiesCache = sortedProperties;
  cacheTimestamp = now;
  
  return sortedProperties;
};

// Get properties by status
export const getPropertiesByStatus = (status: 'available' | 'occupied'): DisplayProperty[] => {
  return getAllProperties().filter(property => property.status === status);
};

// Get available properties only
export const getAvailableProperties = (): DisplayProperty[] => {
  return getPropertiesByStatus('available');
};

// Bookmark utilities
const BOOKMARKS_STORAGE_KEY = 'rentapp_bookmarks';

const getBookmarksStorageKey = (userId?: string) =>
  `${BOOKMARKS_STORAGE_KEY}_${userId ?? 'guest'}`;

// Get all bookmarked property IDs
export const getBookmarkedIds = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(getBookmarksStorageKey(userId)) || '[]');
  } catch (error) {
    console.error('Error reading bookmarks:', error);
    return [];
  }
};

// Check if a property is bookmarked
export const isBookmarked = (propertyId: string, userId?: string): boolean => {
  const bookmarkedIds = getBookmarkedIds(userId);
  return bookmarkedIds.includes(propertyId);
};

// Add a property to bookmarks
export const addBookmark = (propertyId: string, userId?: string): boolean => {
  try {
    const key = getBookmarksStorageKey(userId);
    const bookmarkedIds = getBookmarkedIds(userId);
    if (!bookmarkedIds.includes(propertyId)) {
      bookmarkedIds.push(propertyId);
      localStorage.setItem(key, JSON.stringify(bookmarkedIds));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('bookmarksChanged'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
};

// Remove a property from bookmarks
export const removeBookmark = (propertyId: string, userId?: string): boolean => {
  try {
    const key = getBookmarksStorageKey(userId);
    const bookmarkedIds = getBookmarkedIds(userId);
    const updatedIds = bookmarkedIds.filter(id => id !== propertyId);
    localStorage.setItem(key, JSON.stringify(updatedIds));
    
    // Save to recently removed bookmarks
    addToRecentlyRemoved(propertyId, userId);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('bookmarksChanged'));
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

// Get all bookmarked properties
export const getBookmarkedProperties = (userId?: string): DisplayProperty[] => {
  const bookmarkedIds = getBookmarkedIds(userId);
  const allProperties = getAllProperties();
  return allProperties.filter(property => bookmarkedIds.includes(property.id));
};

// Recently removed bookmarks utilities
const RECENTLY_REMOVED_STORAGE_KEY = 'rentapp_recently_removed_bookmarks';

interface RecentlyRemovedBookmark {
  propertyId: string;
  removedAt: string;
}

const getRecentlyRemovedStorageKey = (userId?: string) =>
  `${RECENTLY_REMOVED_STORAGE_KEY}_${userId ?? 'guest'}`;

// Add a property to recently removed bookmarks
const addToRecentlyRemoved = (propertyId: string, userId?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = getRecentlyRemovedStorageKey(userId);
    const recentlyRemoved: RecentlyRemovedBookmark[] = JSON.parse(
      localStorage.getItem(key) || '[]'
    );
    
    // Remove if already exists (to update timestamp)
    const filtered = recentlyRemoved.filter(item => item.propertyId !== propertyId);
    
    // Add with current timestamp
    filtered.push({
      propertyId,
      removedAt: new Date().toISOString()
    });
    
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error adding to recently removed:', error);
  }
};

// Get all recently removed bookmark IDs
export const getRecentlyRemovedIds = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getRecentlyRemovedStorageKey(userId);
    const recentlyRemoved: RecentlyRemovedBookmark[] = JSON.parse(
      localStorage.getItem(key) || '[]'
    );
    return recentlyRemoved.map(item => item.propertyId);
  } catch (error) {
    console.error('Error reading recently removed bookmarks:', error);
    return [];
  }
};

// Get all recently removed bookmarks with their removal timestamps
export const getRecentlyRemovedBookmarks = (userId?: string): RecentlyRemovedBookmark[] => {
  if (typeof window === 'undefined') return [];
  try {
    const key = getRecentlyRemovedStorageKey(userId);
    const recentlyRemoved: RecentlyRemovedBookmark[] = JSON.parse(
      localStorage.getItem(key) || '[]'
    );
    // Sort by removal date (most recent first)
    return recentlyRemoved.sort((a, b) => 
      new Date(b.removedAt).getTime() - new Date(a.removedAt).getTime()
    );
  } catch (error) {
    console.error('Error reading recently removed bookmarks:', error);
    return [];
  }
};

// Get recently removed properties (full property objects)
export const getRecentlyRemovedProperties = (userId?: string): DisplayProperty[] => {
  const recentlyRemovedIds = getRecentlyRemovedIds(userId);
  const allProperties = getAllProperties();
  return allProperties.filter(property => recentlyRemovedIds.includes(property.id));
};

// Restore a bookmark from recently removed
export const restoreBookmark = (propertyId: string, userId?: string): boolean => {
  try {
    // Add back to bookmarks
    const added = addBookmark(propertyId, userId);
    
    if (added) {
      // Remove from recently removed
      const key = getRecentlyRemovedStorageKey(userId);
      const recentlyRemoved: RecentlyRemovedBookmark[] = JSON.parse(
        localStorage.getItem(key) || '[]'
      );
      const filtered = recentlyRemoved.filter(item => item.propertyId !== propertyId);
      localStorage.setItem(key, JSON.stringify(filtered));
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('bookmarksChanged'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error restoring bookmark:', error);
    return false;
  }
};

// Permanently delete a bookmark from recently removed (without restoring)
export const permanentlyDeleteRemovedBookmark = (propertyId: string, userId?: string): boolean => {
  try {
    const key = getRecentlyRemovedStorageKey(userId);
    const recentlyRemoved: RecentlyRemovedBookmark[] = JSON.parse(
      localStorage.getItem(key) || '[]'
    );
    const filtered = recentlyRemoved.filter(item => item.propertyId !== propertyId);
    localStorage.setItem(key, JSON.stringify(filtered));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('bookmarksChanged'));
    return true;
  } catch (error) {
    console.error('Error permanently deleting removed bookmark:', error);
    return false;
  }
};

// Get only user-created properties (from localStorage, not static)
export const getUserCreatedProperties = (ownerId?: string): DisplayProperty[] => {
  if (typeof window === 'undefined') return [];
  if (!ownerId) return [];
  
  try {
    const localStorageProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );

    let shouldPersist = false;
    const enhancedProperties = localStorageProperties.map((property) => {
      if (!property.ownerId) {
        if (ownerId) {
          shouldPersist = true;
          return {
            ...property,
            ownerId,
            ownerEmail: property.ownerEmail ?? property.contactEmail,
            ownerName: property.ownerName ?? property.contactName
          };
        }
      }
      return property;
    });

    if (shouldPersist) {
      localStorage.setItem('rentapp_properties', JSON.stringify(enhancedProperties));
    }
    
    // Convert to display format
    const convertedProperties = enhancedProperties
      .filter(property => property.ownerId === ownerId)
      .map(convertFormDataToDisplayProperty);
    
    // Sort by updatedAt (most recent first), fallback to createdAt if updatedAt doesn't exist
    return convertedProperties.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || '');
      const dateB = new Date(b.updatedAt || b.createdAt || '');
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  } catch (error) {
    console.error('Error reading user properties:', error);
    return [];
  }
};

// Update an existing property in localStorage
export const updateProperty = (
  propertyId: string,
  updatedProperty: PropertyFormData,
  currentUserId?: string
): boolean => {
  try {
    const existingProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    const propertyIndex = existingProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
      console.error('Property not found:', propertyId);
      return false;
    }

    const existingProperty = existingProperties[propertyIndex];

    if (existingProperty.ownerId && currentUserId && existingProperty.ownerId !== currentUserId) {
      console.error('User not authorized to update this property');
      return false;
    }

    // Update the property while preserving ownership metadata
    existingProperties[propertyIndex] = {
      ...existingProperty,
      ...updatedProperty,
      id: propertyId,
      ownerId: existingProperty.ownerId,
      ownerEmail: existingProperty.ownerEmail,
      ownerName: existingProperty.ownerName,
      createdAt: existingProperty.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('rentapp_properties', JSON.stringify(existingProperties));
    
    // Invalidate cache
    invalidatePropertiesCache();
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyUpdated', { detail: updatedProperty }));
    
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    return false;
  }
};

// Get a property by ID from localStorage
export const getPropertyById = (propertyId: string, ownerId?: string): PropertyFormData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const localStorageProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );

    const property = localStorageProperties.find(p => p.id === propertyId);

    if (!property) {
      return null;
    }

    if (ownerId && property.ownerId && property.ownerId !== ownerId) {
      console.warn('Attempt to access property owned by another user');
      return null;
    }

    return property;
  } catch (error) {
    console.error('Error reading property:', error);
    return null;
  }
};

// Delete a property from localStorage
export const deleteProperty = (propertyId: string, currentUserId?: string): boolean => {
  try {
    const existingProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    const propertyIndex = existingProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
      console.error('Property not found:', propertyId);
      return false;
    }

    const property = existingProperties[propertyIndex];

    if (property.ownerId && currentUserId && property.ownerId !== currentUserId) {
      console.error('User not authorized to delete this property');
      return false;
    }
    
    // Remove the property
    existingProperties.splice(propertyIndex, 1);
    
    localStorage.setItem('rentapp_properties', JSON.stringify(existingProperties));
    
    // Invalidate cache
    invalidatePropertiesCache();
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyDeleted', { detail: propertyId }));
    
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
};

// Follow-up/Ping properties storage
const getFollowUpStorageKey = (userId?: string) => {
  return userId ? `rentapp_followup_${userId}` : 'rentapp_followup';
};

// Add a property to follow-up list
export const addToFollowUp = (propertyId: string, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = getFollowUpStorageKey(userId);
    const followUpList: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Check if already in list
    if (!followUpList.includes(propertyId)) {
      followUpList.push(propertyId);
      localStorage.setItem(key, JSON.stringify(followUpList));
      
      // If property is closed, remove it from closed list
      const closedIds = getClosedPropertyIds(userId);
      if (closedIds.includes(propertyId)) {
        removeFromClosed(propertyId, userId);
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('followUpChanged'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to follow-up:', error);
    return false;
  }
};

// Get all follow-up property IDs
export const getFollowUpPropertyIds = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const key = getFollowUpStorageKey(userId);
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Error reading follow-up properties:', error);
    return [];
  }
};

// Get all follow-up properties
export const getFollowUpProperties = (userId?: string): DisplayProperty[] => {
  try {
    const followUpIds = getFollowUpPropertyIds(userId);
    const closedIds = getClosedPropertyIds(userId);
    const allProperties = getAllProperties();
    // Filter out properties that are closed
    return allProperties.filter(property => 
      followUpIds.includes(property.id) && !closedIds.includes(property.id)
    );
  } catch (error) {
    console.error('Error getting follow-up properties:', error);
    return [];
  }
};

// Remove a property from follow-up list
export const removeFromFollowUp = (propertyId: string, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = getFollowUpStorageKey(userId);
    const followUpList: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = followUpList.filter(id => id !== propertyId);
    localStorage.setItem(key, JSON.stringify(filtered));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('followUpChanged'));
    return true;
  } catch (error) {
    console.error('Error removing from follow-up:', error);
    return false;
  }
};

// Closed properties storage
const getClosedStorageKey = (userId?: string) => {
  return userId ? `rentapp_closed_${userId}` : 'rentapp_closed';
};

// Add a property to closed list
export const addToClosed = (propertyId: string, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = getClosedStorageKey(userId);
    const closedList: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Check if already in list
    if (!closedList.includes(propertyId)) {
      closedList.push(propertyId);
      localStorage.setItem(key, JSON.stringify(closedList));
      
      // Remove from follow-up list if it exists there
      const followUpKey = getFollowUpStorageKey(userId);
      const followUpList: string[] = JSON.parse(localStorage.getItem(followUpKey) || '[]');
      if (followUpList.includes(propertyId)) {
        const filtered = followUpList.filter(id => id !== propertyId);
        localStorage.setItem(followUpKey, JSON.stringify(filtered));
        // Dispatch follow-up changed event
        window.dispatchEvent(new CustomEvent('followUpChanged'));
      }
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('closedChanged'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding to closed:', error);
    return false;
  }
};

// Get all closed property IDs
export const getClosedPropertyIds = (userId?: string): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const key = getClosedStorageKey(userId);
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Error reading closed properties:', error);
    return [];
  }
};

// Get all closed properties
export const getClosedProperties = (userId?: string): DisplayProperty[] => {
  try {
    const closedIds = getClosedPropertyIds(userId);
    const allProperties = getAllProperties();
    return allProperties.filter(property => closedIds.includes(property.id));
  } catch (error) {
    console.error('Error getting closed properties:', error);
    return [];
  }
};

// Remove a property from closed list
export const removeFromClosed = (propertyId: string, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = getClosedStorageKey(userId);
    const closedList: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (closedList.includes(propertyId)) {
      const filtered = closedList.filter(id => id !== propertyId);
      localStorage.setItem(key, JSON.stringify(filtered));
      
      // Do not automatically add to follow-up - just remove from closed
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('closedChanged'));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing from closed:', error);
    return false;
  }
};

// Clear all follow-up and closed properties for all users
export const clearAllFollowUpAndClosed = (userId?: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    
    // Clear all follow-up properties
    keys.forEach(key => {
      if (key.startsWith('rentapp_followup')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    // Clear all closed properties
    keys.forEach(key => {
      if (key.startsWith('rentapp_closed')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    // Also clear all notes for follow-up properties if userId is provided
    if (userId) {
      keys.forEach(key => {
        if (key.startsWith(`rentapp_notes_${userId}_`)) {
          localStorage.removeItem(key);
          clearedCount++;
        }
      });
    }
    
    console.log(`Cleared ${clearedCount} entries from localStorage`);
    
    // Dispatch events to update UI
    window.dispatchEvent(new CustomEvent('followUpChanged'));
    window.dispatchEvent(new CustomEvent('closedChanged'));
  } catch (error) {
    console.error('Error clearing follow-up and closed properties:', error);
  }
};
