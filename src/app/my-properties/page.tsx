'use client';

import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import EditPropertyModal from '@/components/EditPropertyModal';
import ImageEditModal from '@/components/ImageEditModal';
import { getUserCreatedProperties, updateProperty, getPropertyById, deleteProperty, PropertyFormData } from '@/utils/propertyUtils';
import { useEffect, useState } from 'react';
import { usePreventScroll } from '@/hooks/usePreventScroll';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<ReturnType<typeof getUserCreatedProperties>>([]);
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingImageProperty, setEditingImageProperty] = useState<PropertyFormData | null>(null);
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showImageUpdateSuccess, setShowImageUpdateSuccess] = useState(false);

  // Prevent scroll when success messages are shown
  usePreventScroll(showUpdateSuccess || showDeleteSuccess || showImageUpdateSuccess);

  // Load properties on mount
  useEffect(() => {
    setProperties(getUserCreatedProperties());
  }, []);

  // Update properties when localStorage changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      setProperties(getUserCreatedProperties());
    };

    const handlePropertyAdded = () => {
      setProperties(getUserCreatedProperties());
    };

    const handlePropertyUpdated = () => {
      setProperties(getUserCreatedProperties());
    };

    const handlePropertyDeleted = () => {
      setProperties(getUserCreatedProperties());
    };
    
    // Also check for changes when component mounts/focuses
    const handleFocus = () => {
      setProperties(getUserCreatedProperties());
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
  }, []);

  const handleEditClick = (propertyId: string) => {
    try {
      const property = getPropertyById(propertyId);
      if (property) {
        setEditingProperty(property);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Error loading property for editing:', error);
    }
  };

  const handleSaveProperty = (updatedProperty: PropertyFormData) => {
    if (editingProperty) {
      const success = updateProperty(editingProperty.id, updatedProperty);
      if (success) {
        setProperties(getUserCreatedProperties());
        setIsEditModalOpen(false);
        setEditingProperty(null);
        
        // Show success message
        setShowUpdateSuccess(true);
        setTimeout(() => {
          setShowUpdateSuccess(false);
        }, 4000);
      }
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProperty(null);
  };

  const handleEditImageClick = (propertyId: string) => {
    try {
      const property = getPropertyById(propertyId);
      if (property) {
        setEditingImageProperty(property);
        setIsImageEditModalOpen(true);
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
      const success = updateProperty(editingImageProperty.id, updatedProperty);
      if (success) {
        setProperties(getUserCreatedProperties());
        setIsImageEditModalOpen(false);
        setEditingImageProperty(null);
        
        // Show success message
        setShowImageUpdateSuccess(true);
        setTimeout(() => {
          setShowImageUpdateSuccess(false);
        }, 4000);
      }
    }
  };

  const handleCloseImageEditModal = () => {
    setIsImageEditModalOpen(false);
    setEditingImageProperty(null);
  };

  const handleDeleteProperty = (propertyId: string) => {
    const success = deleteProperty(propertyId);
    if (success) {
      setProperties(getUserCreatedProperties());
      setIsEditModalOpen(false);
      setEditingProperty(null);
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('propertyDeleted'));
      
        // Show success message
        setShowDeleteSuccess(true);
        setTimeout(() => {
          setShowDeleteSuccess(false);
        }, 4000);
    }
  };

  const handleStatusChange = (propertyId: string, newStatus: 'available' | 'occupied') => {
    try {
      const property = getPropertyById(propertyId);
      if (property) {
        const updatedProperty: PropertyFormData = {
          ...property,
          status: newStatus
        };
        const success = updateProperty(propertyId, updatedProperty);
        if (success) {
          setProperties(getUserCreatedProperties());
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('propertyUpdated'));
        }
      }
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  return (
    <Layout titleCount={properties.length}>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-2 lg:px-4">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard 
                  property={property} 
                  hideBookmark={true}
                  showEditImageIcon={true}
                  onEditImageClick={() => handleEditImageClick(property.id)}
                  onStatusChange={(newStatus) => handleStatusChange(property.id, newStatus)}
                  onEditClick={() => handleEditClick(property.id)}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">You haven&apos;t listed any properties yet.</p>
              <p className="text-gray-400 text-sm mt-2">Start listing your properties to see them here!</p>
            </div>
          )}
        </div>
      </div>

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

      {/* Image Update Success Message */}
      {showImageUpdateSuccess && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center z-50 pt-8" style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}>
          <div className="bg-green-500 text-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-1">Congratulations..!</h2>
            <h3 className="text-xl font-bold">Property Updated Successfully.</h3>
          </div>
        </div>
      )}
    </Layout>
  );
}
