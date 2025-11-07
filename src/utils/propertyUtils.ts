import { properties as staticProperties } from '@/data/properties';

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
  createdAt: string;
  updatedAt?: string;
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
  createdAt?: string;
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
    createdAt: formData.createdAt
  };
};

// Get all properties (static + localStorage)
export const getAllProperties = (): DisplayProperty[] => {
  // Get static properties
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
  
  return allProperties.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || '');
    const dateB = new Date(b.updatedAt || b.createdAt || '');
    return dateB.getTime() - dateA.getTime();
  });
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

// Get all bookmarked property IDs
export const getBookmarkedIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error reading bookmarks:', error);
    return [];
  }
};

// Check if a property is bookmarked
export const isBookmarked = (propertyId: string): boolean => {
  const bookmarkedIds = getBookmarkedIds();
  return bookmarkedIds.includes(propertyId);
};

// Add a property to bookmarks
export const addBookmark = (propertyId: string): boolean => {
  try {
    const bookmarkedIds = getBookmarkedIds();
    if (!bookmarkedIds.includes(propertyId)) {
      bookmarkedIds.push(propertyId);
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
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
export const removeBookmark = (propertyId: string): boolean => {
  try {
    const bookmarkedIds = getBookmarkedIds();
    const updatedIds = bookmarkedIds.filter(id => id !== propertyId);
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedIds));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('bookmarksChanged'));
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
};

// Get all bookmarked properties
export const getBookmarkedProperties = (): DisplayProperty[] => {
  const bookmarkedIds = getBookmarkedIds();
  const allProperties = getAllProperties();
  return allProperties.filter(property => bookmarkedIds.includes(property.id));
};

// Get only user-created properties (from localStorage, not static)
export const getUserCreatedProperties = (): DisplayProperty[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const localStorageProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    // Convert to display format
    const convertedProperties = localStorageProperties.map(convertFormDataToDisplayProperty);
    
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
export const updateProperty = (propertyId: string, updatedProperty: PropertyFormData): boolean => {
  try {
    const existingProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    const propertyIndex = existingProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
      console.error('Property not found:', propertyId);
      return false;
    }
    
    // Update the property
    existingProperties[propertyIndex] = {
      ...updatedProperty,
      id: propertyId, // Ensure ID doesn't change
      createdAt: existingProperties[propertyIndex].createdAt, // Preserve original creation date
      updatedAt: new Date().toISOString() // Set update timestamp
    };
    
    localStorage.setItem('rentapp_properties', JSON.stringify(existingProperties));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyUpdated', { detail: updatedProperty }));
    
    return true;
  } catch (error) {
    console.error('Error updating property:', error);
    return false;
  }
};

// Get a property by ID from localStorage
export const getPropertyById = (propertyId: string): PropertyFormData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const localStorageProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    return localStorageProperties.find(p => p.id === propertyId) || null;
  } catch (error) {
    console.error('Error reading property:', error);
    return null;
  }
};

// Delete a property from localStorage
export const deleteProperty = (propertyId: string): boolean => {
  try {
    const existingProperties: PropertyFormData[] = JSON.parse(
      localStorage.getItem('rentapp_properties') || '[]'
    );
    
    const propertyIndex = existingProperties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
      console.error('Property not found:', propertyId);
      return false;
    }
    
    // Remove the property
    existingProperties.splice(propertyIndex, 1);
    
    localStorage.setItem('rentapp_properties', JSON.stringify(existingProperties));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('propertyDeleted', { detail: propertyId }));
    
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
};
