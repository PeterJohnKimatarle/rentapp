'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/properties';
import { Property } from '@/data/properties';
import { Trash2 } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Property[]>(properties);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleBookmarkClick = (property: Property) => {
    setSelectedProperty(property);
    setShowRemoveModal(true);
  };

  const handleRemoveBookmark = () => {
    if (selectedProperty) {
      setBookmarkedProperties(prev => 
        prev.filter(property => property.id !== selectedProperty.id)
      );
      setShowRemoveModal(false);
      setSelectedProperty(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedProperty(null);
  };

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showRemoveModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showRemoveModal]);

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 lg:px-4">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {bookmarkedProperties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onBookmarkClick={() => handleBookmarkClick(property)}
            />
          ))}
        </div>
      </div>

      {/* Remove Bookmark Confirmation Modal */}
      {showRemoveModal && selectedProperty && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden' }}
        >
          <div 
            className="rounded-lg max-w-sm w-full p-6 shadow-lg"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-4">
                <Trash2 size={48} className="mx-auto text-white mb-2" />
                <h3 className="text-lg font-semibold text-white mb-2 px-4" style={{ borderBottom: '2px solid #eab308' }}>Remove from Bookmarks</h3>
                <p className="text-white/80 text-sm">Do you want to remove this property from your bookmarks?</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelRemove}
                  className="flex-1 bg-red-400/75 hover:bg-red-500/75 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleRemoveBookmark}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
