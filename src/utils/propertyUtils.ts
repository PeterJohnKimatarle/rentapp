import { Property as StaticProperty, properties as staticProperties } from '@/data/properties';

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
    updatedAt: formData.createdAt,
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
