'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import PropertyCard from '@/components/PropertyCard';
import { getBookmarkedProperties, removeBookmark, DisplayProperty } from '@/utils/propertyUtils';
import { Heart } from 'lucide-react';
import { usePreventScroll } from '@/hooks/usePreventScroll';
import { useAuth } from '@/contexts/AuthContext';

type SearchFilters = {
  propertyType?: string;
  status?: string;
  region?: string;
  ward?: string;
};

export default function BookmarksPage() {
  const { user, isLoading } = useAuth();
  const userId = user?.id;
  const [bookmarkedProperties, setBookmarkedProperties] = useState<DisplayProperty[]>([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<DisplayProperty | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);

  // Update bookmarks when localStorage changes
  useEffect(() => {
    const handleBookmarksChange = () => {
      if (userId) {
        setBookmarkedProperties(getBookmarkedProperties(userId));
      }
    };

    // Listen for bookmark changes
    window.addEventListener('bookmarksChanged', handleBookmarksChange);

    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarksChange);
    };
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setBookmarkedProperties(getBookmarkedProperties(userId));
    } else {
      setBookmarkedProperties([]);
    }
  }, [userId]);

  const applyFilters = useCallback((items: DisplayProperty[], filters: SearchFilters | null) => {
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
    () => applyFilters(bookmarkedProperties, activeFilters),
    [bookmarkedProperties, activeFilters, applyFilters]
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

  const hasActiveFilters = activeFilters !== null;

  // Block background scroll when modal is open
  usePreventScroll(showRemoveModal);

  const handleBookmarkClick = (property: DisplayProperty) => {
    setSelectedProperty(property);
    setShowRemoveModal(true);
  };

  const handleRemoveBookmark = () => {
    if (selectedProperty && userId) {
      removeBookmark(selectedProperty.id, userId);
      setBookmarkedProperties(getBookmarkedProperties(userId));
      setShowRemoveModal(false);
      setSelectedProperty(null);
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedProperty(null);
  };

  // Wait silently during loading - don't show anything
  if (isLoading) {
    return null;
  }

  // Only show login message after loading is complete
  if (!userId) {
    return (
      <Layout totalCount={0} filteredCount={0} hasActiveFilters={false}>
        <div className="w-full max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 text-lg">Log in to view your bookmarked properties.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      totalCount={bookmarkedProperties.length}
      filteredCount={filteredProperties.length}
      hasActiveFilters={hasActiveFilters}
    >
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-2 lg:px-4 pt-1 sm:pt-2 lg:pt-3">
        {/* Properties Grid */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onBookmarkClick={() => handleBookmarkClick(property)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-xl">
                {bookmarkedProperties.length === 0 && !hasActiveFilters
                  ? 'No bookmarked properties yet.'
                  : 'No properties available for now.'}
              </p>
              <p className="text-gray-400 text-base mt-1">
                {bookmarkedProperties.length === 0 && !hasActiveFilters
                  ? 'Bookmark properties to see them here.'
                  : 'Check back later or adjust your filters.'}
              </p>
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
                <h3 className="text-lg font-semibold text-white mb-2 px-4">Remove from Bookmarks</h3>
                <p className="text-white/80 text-sm">Are you sure you want to remove this property from your bookmarks?</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRemoveBookmark}
                  className="flex-1 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
