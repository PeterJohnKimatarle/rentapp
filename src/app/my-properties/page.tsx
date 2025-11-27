'use client';

import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import EditPropertyModal from '@/components/EditPropertyModal';
import ImageEditModal from '@/components/ImageEditModal';
import { getUserCreatedProperties, updateProperty, getPropertyById, deleteProperty, PropertyFormData } from '@/utils/propertyUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePreventScroll } from '@/hooks/usePreventScroll';
import { useAuth } from '@/contexts/AuthContext';

type SearchFilters = {
  propertyType?: string;
  status?: string;
  region?: string;
  ward?: string;
};

export default function MyPropertiesPage() {
  const { user, isLoading } = useAuth();
  const userId = user?.id;
  const [properties, setProperties] = useState<ReturnType<typeof getUserCreatedProperties>>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImageProperty, setEditingImageProperty] = useState<PropertyFormData | null>(null);
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  // Prevent scroll when success messages are shown
  usePreventScroll(showUpdateSuccess || showDeleteSuccess);

  // Load properties on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userId) {
      setProperties(getUserCreatedProperties(userId));
    } else {
      setProperties([]);
    }
  }, [userId]);

  // Update properties when localStorage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
    };

    const handlePropertyAdded = () => {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
      setIsHydrated(true);
    };

    const handlePropertyUpdated = () => {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
      setIsHydrated(true);
    };

    const handlePropertyDeleted = () => {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
      setIsHydrated(true);
    };
    
    // Also check for changes when component mounts/focuses
    const handleFocus = () => {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom property added event
    window.addEventListener('propertyAdded', handlePropertyAdded);
    
    // Listen for property updated event
    window.addEventListener('propertyUpdated', handlePropertyUpdated);
    
    // Listen for property deleted event
    window.addEventListener('propertyDeleted', handlePropertyDeleted);
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propertyAdded', handlePropertyAdded);
      window.removeEventListener('propertyUpdated', handlePropertyUpdated);
      window.removeEventListener('propertyDeleted', handlePropertyDeleted);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId]);

  const applyFilters = useCallback((items: ReturnType<typeof getUserCreatedProperties>, filters: SearchFilters | null) => {
    if (!filters) return items;

    const normalise = (value?: string) => value?.toLowerCase().trim();

    return items.filter((property) => {
      const matchesPropertyType = filters.propertyType
        ? normalise(property.propertyType) === normalise(filters.propertyType)
        : true;

      const matchesStatus = filters.status ? property.status === filters.status : true;

      const matchesRegion = filters.region
        ? normalise(property.region) === normalise(filters.region)
        : true;

      const matchesWard = filters.ward ? normalise(property.ward) === normalise(filters.ward) : true;

      return matchesPropertyType && matchesStatus && matchesRegion && matchesWard;
    });
  }, []);

  const filteredProperties = useMemo(
    () => applyFilters(properties, activeFilters),
    [properties, activeFilters, applyFilters]
  );

  useEffect(() => {
    const handleSearch = (event: Event) => {
      const { detail } = event as CustomEvent<SearchFilters>;
      const filters = detail || {};

      const hasFilters = Object.values(filters).some((value) => {
        if (typeof value === 'string') {
          return value.trim().length > 0;
        }
        return Boolean(value);
      });

      setActiveFilters(hasFilters ? filters : null);
    };

    window.addEventListener('rentappSearch', handleSearch as EventListener);

    return () => {
      window.removeEventListener('rentappSearch', handleSearch as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleSuccess = () => {
      setShowUpdateSuccess(true);
      window.setTimeout(() => {
        setShowUpdateSuccess(false);
      }, 2000);
    };

    window.addEventListener('propertyEditSuccess', handleSuccess);

    return () => {
      window.removeEventListener('propertyEditSuccess', handleSuccess);
    };
  }, []);

  const hasActiveFilters = activeFilters !== null;

  const handleEditClick = (propertyId: string) => {
    try {
      const property = getPropertyById(propertyId, userId);
      if (property) {
        setEditingProperty(property);
        setIsEditModalOpen(true);
        if (properties.length) {
          setActivePropertyId(propertyId);
        }
      }
    } catch (error) {
      console.error('Error loading property for editing:', error);
    }
  };

  const handleSaveProperty = (updatedProperty: PropertyFormData) => {
    if (editingProperty) {
      const success = updateProperty(editingProperty.id, updatedProperty, userId);
      if (success) {
        if (userId) {
          setProperties(getUserCreatedProperties(userId));
        }
        setIsEditModalOpen(false);
        setEditingProperty(null);
        setActivePropertyId(editingProperty.id);
      }
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
  };

  const handleEditImageClick = (propertyId: string) => {
    try {
      const property = getPropertyById(propertyId, userId);
      if (property) {
        setEditingImageProperty(property);
        setIsImageEditModalOpen(true);
        setActivePropertyId(propertyId);
      }
    } catch (error) {
      console.error('Error loading property for image editing:', error);
    }
  };

  const handleSaveImages = (mainImage: string, additionalImages: string[]) => {
    if (editingImageProperty) {
      const allImages = mainImage ? [mainImage, ...additionalImages] : additionalImages;
      const updatedProperty: PropertyFormData = {
        ...editingImageProperty,
        images: allImages
      };
      const success = updateProperty(editingImageProperty.id, updatedProperty, userId);
      if (success) {
        if (userId) {
          setProperties(getUserCreatedProperties(userId));
        }
        setIsImageEditModalOpen(false);
        setEditingImageProperty(null);
        setActivePropertyId(editingImageProperty.id);
      }
    }
  };

  const handleCloseImageEditModal = () => {
    setIsImageEditModalOpen(false);
    setEditingImageProperty(null);
  };

  const handleDeleteProperty = (propertyId: string) => {
    const success = deleteProperty(propertyId, userId);
    if (success) {
      if (userId) {
        setProperties(getUserCreatedProperties(userId));
      }
      setIsEditModalOpen(false);
      setEditingProperty(null);
      if (activePropertyId === propertyId) {
        setActivePropertyId(null);
      }
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('propertyDeleted'));
      
        // Show success message
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 2000);
    }
  };

  const handleStatusChange = (propertyId: string, newStatus: 'available' | 'occupied') => {
    try {
      const property = getPropertyById(propertyId, userId);
      if (property) {
        const updatedProperty: PropertyFormData = {
          ...property,
          status: newStatus
        };
        const success = updateProperty(propertyId, updatedProperty, userId);
        if (success) {
          if (userId) {
            setProperties(getUserCreatedProperties(userId));
          }
          setActivePropertyId(propertyId);
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('propertyUpdated'));
        }
      }
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const renderContent = () => {
    // Wait silently during loading - don't show anything
    if (isLoading) {
      return null;
    }

    if (!isHydrated) {
      return null;
    }

    // Only show login message after loading is complete
    if (!userId) {
      return (
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-2 lg:px-4">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Log in to manage your listed properties.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-2 lg:px-4">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard 
                  property={property} 
                  hideBookmark={true}
                  showEditImageIcon={true}
                  onEditImageClick={() => handleEditImageClick(property.id)}
                  onStatusChange={(newStatus) => handleStatusChange(property.id, newStatus)}
                  onEditClick={() => handleEditClick(property.id)}
                  onManageStart={() => setActivePropertyId(property.id)}
                  isActiveProperty={activePropertyId === property.id}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              {properties.length === 0 && !hasActiveFilters ? (
                <>
                  <p className="text-gray-500 text-xl">You haven&apos;t listed any properties yet.</p>
                  <p className="text-gray-400 text-base mt-1">List properties to see them here.</p>
                </>
              ) : (
                <>
                  <p className="text-gray-500 text-xl">No properties available for now.</p>
                  <p className="text-gray-400 text-base mt-1">Check back later or adjust your filters.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout
      totalCount={properties.length}
      filteredCount={filteredProperties.length}
      hasActiveFilters={hasActiveFilters}
    >
      {renderContent()}

      {/* Edit Property Modal */}
      {isEditModalOpen && editingProperty && (
        <EditPropertyModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          property={editingProperty}
          onSave={handleSaveProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Image Edit Modal */}
      {isImageEditModalOpen && editingImageProperty && (
        <ImageEditModal
          isOpen={isImageEditModalOpen}
          onClose={handleCloseImageEditModal}
          onSave={handleSaveImages}
          currentImages={editingImageProperty.images || []}
        />
      )}

      {/* Update Success Message */}
      {showUpdateSuccess && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center z-50 pt-8" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}>
          <div className="bg-green-500 text-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-1">Congratulations..!</h2>
            <h3 className="text-xl font-bold">Property Updated Successfully.</h3>
          </div>
        </div>
      )}

      {/* Delete Success Message */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center z-50 pt-8" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}>
          <div className="bg-blue-500 p-6 rounded-lg text-center max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-1 text-red-400">Property deleted..!</h2>
            <h3 className="text-xl font-bold text-white">The property has been deleted successfully.</h3>
          </div>
        </div>
      )}
    </Layout>
  );
}
