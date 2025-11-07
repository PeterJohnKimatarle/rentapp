'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { getBookmarkedProperties, removeBookmark, DisplayProperty } from '@/utils/propertyUtils';
import { Heart } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';

export default function BookmarksPage() {
  const [bookmarkedProperties, setBookmarkedProperties] = useState<DisplayProperty[]>(getBookmarkedProperties());
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<DisplayProperty | null>(null);

  // Update bookmarks when localStorage changes
  useEffect(() => {
    const handleBookmarksChange = () => {
      setBookmarkedProperties(getBookmarkedProperties());
    };

    // Listen for bookmark changes
    window.addEventListener('bookmarksChanged', handleBookmarksChange);
    
    // Also check for changes when component mounts/focuses
    const handleFocus = () => {
      setBookmarkedProperties(getBookmarkedProperties());
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarksChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Block background scroll when modal is open
  usePreventScroll(showRemoveModal);

  const handleBookmarkClick = (property: DisplayProperty) => {
    setSelectedProperty(property);
    setShowRemoveModal(true);
  };

  const handleRemoveBookmark = () => {
    if (selectedProperty) {
      removeBookmark(selectedProperty.id);
      setBookmarkedProperties(getBookmarkedProperties());
      setShowRemoveModal(false);
      setSelectedProperty(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedProperty(null);
  };

  return (
    <Layout titleCount={bookmarkedProperties.length}>
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 lg:px-4">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {bookmarkedProperties.length > 0 ? (
            bookmarkedProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onBookmarkClick={() => handleBookmarkClick(property)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No bookmarked properties yet.</p>
              <p className="text-gray-400 text-sm mt-2">Start bookmarking properties to see them here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Remove Bookmark Confirmation Modal */}
      {showRemoveModal && selectedProperty && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden', touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-xl max-w-sm w-full p-6 shadow-lg overflow-hidden"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-4">
                <Heart size={48} className="mx-auto text-white mb-2" />
                <h3 className="text-lg font-semibold text-white mb-2 px-4" style={{ borderBottom: '2px solid #eab308' }}>Remove from Bookmarks</h3>
                <p className="text-white/80 text-sm">Are you sure you want to remove this property from your bookmarks?</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRemoveBookmark}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="flex-1 bg-red-400/75 hover:bg-red-500/75 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
