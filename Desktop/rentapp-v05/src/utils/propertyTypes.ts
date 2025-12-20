/**
 * Property Types Data Structure
 * Hierarchical system with parent categories and their children
 */

export interface PropertyTypeCategory {
  label: string;
  value: string;
  children?: string[];
}

export const PROPERTY_TYPE_CATEGORIES: Record<string, string[]> = {
  'Apartment': [
    '1 Bdrm Apartment',
    '2 Bdrm Apartment',
    '3 Bdrm Apartment',
    '4 Bdrm Apartment',
    '5+ Bdrm Apartment',
    'Studio Apartment'
  ],
  'House': [
    '1 Bdrm House',
    '2 Bdrm House',
    '3 Bdrm House',
    '4 Bdrm House',
    '5+ Bdrm House'
  ],
  'Commercial Property': [
    'Office Space',
    'Shop (Frame)',
    'Co-Working Space',
    'Warehouse/Godown'
  ],
  'Short Stay/Hospitality': [
    'Hotel Room',
    'Lodge',
    'Hostel (travelers)',
    'Guest House'
  ],
  'Land & Outdoor': [
    'Parking Yard',
    'Farm House (Agricultural)',
    'Open Space'
  ],
  'Villa': [
    'Luxury Villa',
    'Beach Villa'
  ],
  'Event Hall': [
    'Conference Center',
    'Wedding Venue'
  ]
};

// Categories that have NO sub-categories (select directly)
export const DIRECT_SELECT_CATEGORIES = [
  'Single Room (Shared House)',
  'Master Room',
  'Hostel (student housing)'
];

// All main categories in the order specified by user
export const ALL_PROPERTY_CATEGORIES = [
  'Apartment',
  'House',
  'Commercial Property',
  'Single Room (Shared House)',
  'Master Room',
  'Short Stay/Hospitality',
  'Hostel (student housing)',
  'Event Hall',
  'Land & Outdoor',
  'Villa'
];

/**
 * Get children for a parent category
 * @param parent - The parent category name
 * @returns Array of children or null if category has no children
 */
export const getPropertyTypeChildren = (parent: string): string[] | null => {
  if (DIRECT_SELECT_CATEGORIES.includes(parent)) {
    return null; // No children, select directly
  }
  return PROPERTY_TYPE_CATEGORIES[parent] || null;
};

/**
 * Check if a category has sub-categories
 * @param category - The category name
 * @returns Boolean indicating if category has sub-categories
 */
export const hasSubCategories = (category: string): boolean => {
  return !DIRECT_SELECT_CATEGORIES.includes(category) && 
         category in PROPERTY_TYPE_CATEGORIES;
};

/**
 * Get all main property type categories
 * @returns Array of all main category names
 */
export const getAllPropertyTypes = (): string[] => {
  return ALL_PROPERTY_CATEGORIES;
};

/**
 * Parse property type string to extract parent and child
 * Handles both formats: "parent|child" and direct category names
 * @param propertyType - The property type string
 * @returns Object with parent and child, or null if invalid
 */
export const parsePropertyType = (propertyType: string): { parent: string; child: string | null } | null => {
  if (!propertyType) return null;
  
  // Check if it's a direct select category
  if (DIRECT_SELECT_CATEGORIES.includes(propertyType)) {
    return { parent: propertyType, child: null };
  }
  
  // Check if it's in format "parent|child"
  if (propertyType.includes('|')) {
    const [parent, child] = propertyType.split('|');
    return { parent: parent.trim(), child: child.trim() };
  }
  
  // Try to find parent category
  for (const [parent, children] of Object.entries(PROPERTY_TYPE_CATEGORIES)) {
    if (children.includes(propertyType)) {
      return { parent, child: propertyType };
    }
  }
  
  // Check if it's a direct category name
  if (ALL_PROPERTY_CATEGORIES.includes(propertyType)) {
    return { parent: propertyType, child: null };
  }
  
  return null;
};

/**
 * Format property type for storage
 * @param parent - Parent category
 * @param child - Child category (optional)
 * @returns Formatted string for storage
 */
export const formatPropertyType = (parent: string, child?: string | null): string => {
  if (!child || DIRECT_SELECT_CATEGORIES.includes(parent)) {
    return parent;
  }
  return `${parent}|${child}`;
};

/**
 * Get display label for property type
 * @param propertyType - The property type string
 * @returns Display label
 */
export const getPropertyTypeDisplayLabel = (propertyType: string): string => {
  const parsed = parsePropertyType(propertyType);
  if (!parsed) return propertyType;
  
  if (parsed.child) {
    return parsed.child;
  }
  return parsed.parent;
};











