'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Image, Clock, Heart, Pencil, Radio, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/data/properties';
import { DisplayProperty, isBookmarked, addBookmark, removeBookmark } from '@/utils/propertyUtils';
import { useAuth } from '@/contexts/AuthContext';
import ImageLightbox from './ImageLightbox';
import SharePopup from './SharePopup';
import { usePreventScroll } from '@/hooks/usePreventScroll';

interface PropertyCardProps {
  property: Property | DisplayProperty;
  onBookmarkClick?: () => void;
  showMinusIcon?: boolean;
  hideBookmark?: boolean;
  showEditImageIcon?: boolean;
  onEditImageClick?: () => void;
  onStatusChange?: (newStatus: 'available' | 'occupied') => void;
  onEditClick?: () => void;
  onManageStart?: () => void;
  isActiveProperty?: boolean;
  showBookmarkConfirmation?: boolean;
  onApplyStagedChanges?: () => void;
  stagedImageCount?: number;
}

export default function PropertyCard({ property, onBookmarkClick, showMinusIcon = false, hideBookmark = false, showEditImageIcon = false, onEditImageClick, onStatusChange, onEditClick, onManageStart, isActiveProperty = false, showBookmarkConfirmation = true, onApplyStagedChanges, stagedImageCount }: PropertyCardProps) {
  const { user } = useAuth();
  const userId = user?.id;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isArrowHovered, setIsArrowHovered] = useState(false);
  const [isFromHomescreen, setIsFromHomescreen] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShareSpinning, setIsShareSpinning] = useState(false);
  const [lastViewedId, setLastViewedId] = useState<string | null>(null);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [showRemoveBookmarkPopup, setShowRemoveBookmarkPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const preloadedImagesRef = useRef<Set<number>>(new Set());
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'available' | 'occupied' | ''>(property.status);
  const [pendingImages, setPendingImages] = useState(false);
  const [pendingDetails, setPendingDetails] = useState(false);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [headerFontSize, setHeaderFontSize] = useState(24); // Start with 1.5rem (24px)

  useEffect(() => {
    setPendingStatus(property.status);
  }, [property.status]);

  // Adjust header font size to fit content on one line
  useEffect(() => {
    if (!isDetailsOpen || !headerRef.current) return;

    const element = headerRef.current;
    const container = element.parentElement;
    if (!container) return;

    // Reset to initial size
    let fontSize = 24; // 1.5rem
    element.style.fontSize = `${fontSize}px`;

    // Check if text overflows
    const checkFit = () => {
      if (element.scrollWidth > container.offsetWidth && fontSize > 12) {
        fontSize = Math.max(12, fontSize - 1); // Decrease by 1px, minimum 12px
        element.style.fontSize = `${fontSize}px`;
        requestAnimationFrame(checkFit);
      } else {
        setHeaderFontSize(fontSize);
      }
    };

    // Small delay to ensure DOM is updated
    setTimeout(checkFit, 10);
  }, [isDetailsOpen, property]);

  const isSubmitDisabled =
    pendingStatus === property.status && !pendingImages && !pendingDetails;

  // Restore scroll position when popup opens
  useEffect(() => {
    if (isDetailsOpen && scrollContainerRef.current && savedScrollPosition > 0) {
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    }
  }, [isDetailsOpen, savedScrollPosition]);

  // Preload the first image when component mounts
  useEffect(() => {
    if (!preloadedImagesRef.current.has(0)) {
      const img = new window.Image();
      img.onload = () => {
        preloadedImagesRef.current.add(0);
        setIsImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageError(true);
        setIsImageLoaded(true);
      };
      img.src = property.images[0];
    } else {
      setIsImageLoaded(true);
    }
  }, [property.images]);

  // Reset preview index when property changes (desktop only)
  useEffect(() => {
    setPreviewImageIndex(0);
  }, [property.id]);

  // Ensure preview index stays at 0 on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setPreviewImageIndex(0);
        setIsHovered(false);
        setIsArrowHovered(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Check on mount
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload adjacent images for smoother navigation
  useEffect(() => {
    const preloadImage = (index: number) => {
      if (index >= 0 && index < property.images.length && !preloadedImagesRef.current.has(index)) {
        const img = new window.Image();
        img.src = property.images[index];
        preloadedImagesRef.current.add(index);
      }
    };

    // Preload previous and next images
    const prevIndex = previewImageIndex > 0 ? previewImageIndex - 1 : property.images.length - 1;
    const nextIndex = previewImageIndex < property.images.length - 1 ? previewImageIndex + 1 : 0;
    
    preloadImage(prevIndex);
    preloadImage(nextIndex);
  }, [previewImageIndex, property.images]);

  // Prevent body scrolling when popup is open
  usePreventScroll(isDetailsOpen || showBookmarkPopup || showRemoveBookmarkPopup || showSharePopup || showActionPopup);

  // Check bookmark status and listen for changes
  useEffect(() => {
    const checkBookmarkStatus = () => {
      setBookmarked(isBookmarked(property.id, userId));
    };

    // Check initial status
    checkBookmarkStatus();

    // Listen for bookmark changes
    const handleBookmarksChanged = () => {
      checkBookmarkStatus();
    };

    window.addEventListener('bookmarksChanged', handleBookmarksChanged);

    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarksChanged);
    };
  }, [property.id, userId]);

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
    // Replace TZS or TSh with Tsh (lowercase 's')
    return formatted.replace(/TZS|TSh/gi, 'Tsh');
  };

  const formatPropertyType = (propertyType?: string) => {
    if (!propertyType) return 'Property';
    const typeMap: { [key: string]: string } = {
      '1-bdrm-apartment': '1 Bdrm Apartment',
      '2-bdrm-apartment': '2 Bdrm Apartment',
      '3-bdrm-apartment': '3 Bdrm Apartment',
      '4-bdrm-apartment': '4 Bdrm Apartment',
      '5-bdrm-apartment': '5 Bdrm Apartment',
      'commercial-building-frame': 'Commercial Building (Frame)',
    };
    return typeMap[propertyType] || propertyType.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleImageClick = () => {
    setIsLightboxOpen(true);
    setCurrentImageIndex(previewImageIndex);
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only work on desktop (xl and above)
    if (window.innerWidth >= 1280) {
      setPreviewImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only work on desktop (xl and above)
    if (window.innerWidth >= 1280) {
      setPreviewImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0));
    }
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Coming from homescreen - reset to first image and clear scroll position
    setIsFromHomescreen(true);
    setCurrentImageIndex(0);
    setSavedScrollPosition(0); // Reset scroll position to top
    setIsDetailsOpen(true);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareSpinning(true);
    
    // Reset spinning after animation
    setTimeout(() => {
      setIsShareSpinning(false);
    }, 100);
    
    // Wait 200ms after spinning completes before opening popup
    setTimeout(() => {
      setShowSharePopup(true);
    }, 300); // 100ms for spinning + 200ms delay
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmarkClick) {
      onBookmarkClick();
    } else if (!showBookmarkConfirmation) {
      // Directly add/remove bookmark without confirmation
      if (!userId) {
        alert('Please log in to save bookmarks.');
        return;
      }
      if (bookmarked) {
        removeBookmark(property.id, userId);
        setBookmarked(false);
      } else {
        addBookmark(property.id, userId);
        setBookmarked(true);
      }
    } else {
      // If already bookmarked, show remove popup, otherwise show save popup
      if (bookmarked) {
        setShowRemoveBookmarkPopup(true);
      } else {
        setShowBookmarkPopup(true);
      }
    }
  };

  const handleSaveProperty = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      alert('Please log in to save bookmarks.');
      setShowBookmarkPopup(false);
      return;
    }
    // Save bookmark to localStorage
    addBookmark(property.id, userId);
    setBookmarked(true); // Update state immediately
    setShowBookmarkPopup(false);
  };

  const handleCancelBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBookmarkPopup(false);
  };

  const handleRemoveBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      setShowRemoveBookmarkPopup(false);
      return;
    }
    // Remove bookmark from localStorage
    removeBookmark(property.id, userId);
    setBookmarked(false); // Update state immediately
    setShowRemoveBookmarkPopup(false);
  };

  const handleCancelRemoveBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRemoveBookmarkPopup(false);
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const updatedAt = new Date(dateString);
    let diffInSeconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);

    // Ensure minimum is 2 seconds (handle 0, 1, and negative values)
    if (diffInSeconds < 2) {
      diffInSeconds = 2;
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      if (years >= 3) {
        return '3+ years ago';
      }
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  };

  // Keep constant border width to prevent layout shift on click
  // No colored border; indicator shown next to title instead
  const borderClass = 'border-[3px] border-transparent shadow-sm hover:shadow-md';

  const showSuccessMessage = () => {
    const event = new CustomEvent('propertyEditSuccess');
    window.dispatchEvent(event);
  };

  // Track and react to the most recently viewed property
  useEffect(() => {
    // Listen for changes (session-only; do not persist across reloads)
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ id: string }>;
      if (custom && custom.detail && custom.detail.id) {
        setLastViewedId(custom.detail.id);
      }
    };
    window.addEventListener('lastViewedPropertyChanged', handler as EventListener);
    return () => {
      window.removeEventListener('lastViewedPropertyChanged', handler as EventListener);
    };
  }, []);

  // When this card's details open, mark it as the most recently viewed
  useEffect(() => {
    if (isDetailsOpen) {
      // Broadcast most recently viewed (in-memory only)
      const evt = new CustomEvent('lastViewedPropertyChanged', { detail: { id: property.id } });
      window.dispatchEvent(evt);
    }
  }, [isDetailsOpen, property.id]);

  return (
    <>
      <div className={`bg-white rounded-lg transition-shadow duration-200 overflow-hidden ${borderClass}`}>
        <div className="flex flex-row min-w-0">
          {/* Property Image */}
          <div 
            className="w-44 sm:w-52 md:w-64 lg:w-96 h-52 sm:h-60 md:h-72 lg:h-96 xl:h-80 flex-shrink-0 relative"
            onMouseEnter={() => {
              // Only handle hover on desktop (xl and above)
              if (window.innerWidth >= 1280) {
                setIsHovered(true);
              }
            }}
            onMouseLeave={() => {
              // Only handle hover on desktop (xl and above)
              if (window.innerWidth >= 1280) {
                setIsHovered(false);
                setIsArrowHovered(false);
                setPreviewImageIndex(0);
              }
            }}
          >
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}
            {isActiveProperty && (
              <span className="absolute top-2 w-3 h-3 rounded-full bg-yellow-500 shadow shadow-yellow-500/60 z-20" style={{ right: '0.35rem', border: '1.5px solid black' }} />
            )}
            {imageError || !property.images[0] ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden" onClick={handleImageClick}>
                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="p-6">
                    <img
                      src="/icon.png"
                      alt="Rentapp Logo"
                      className="w-16 h-16 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile: Always show first image, Desktop: Show preview index */}
              <img
                src={property.images[0]}
                alt={property.title}
                  className="w-full h-full object-cover cursor-pointer xl:hidden"
                onClick={handleImageClick}
                onError={() => setImageError(true)}
                style={{ 
                  opacity: isImageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
                <img
                  src={property.images[previewImageIndex]}
                  alt={property.title}
                  className="hidden xl:block w-full h-full object-cover cursor-pointer"
                  onClick={handleImageClick}
                  onError={() => setImageError(true)}
                  style={{ 
                    opacity: isImageLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
                {/* Navigation Arrows - Only on Desktop (xl and above) */}
                {property.images.length > 1 && (
                  <>
                    {/* Left Arrow */}
                    <button
                      onClick={handlePreviousImage}
                      onMouseEnter={() => {
                        if (window.innerWidth >= 1280) setIsArrowHovered(true);
                      }}
                      onMouseLeave={() => {
                        if (window.innerWidth >= 1280) setIsArrowHovered(false);
                      }}
                      className={`hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-md px-3.5 py-2 shadow-lg transition-opacity duration-200 z-30 items-center justify-center cursor-pointer ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={26} />
                    </button>
                    {/* Right Arrow */}
                    <button
                      onClick={handleNextImage}
                      onMouseEnter={() => {
                        if (window.innerWidth >= 1280) setIsArrowHovered(true);
                      }}
                      onMouseLeave={() => {
                        if (window.innerWidth >= 1280) setIsArrowHovered(false);
                      }}
                      className={`hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-md px-3.5 py-2 shadow-lg transition-opacity duration-200 z-30 items-center justify-center cursor-pointer ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      aria-label="Next image"
                    >
                      <ChevronRight size={26} />
                    </button>
                  </>
                )}
              </>
            )}
            {/* Status Banner */}
            <div className={`absolute top-1 left-1 px-2 py-0.5 xl:px-3 xl:py-1 rounded text-xs xl:text-sm font-medium xl:font-semibold border-[1.5px] border-black ${
              property.status === 'available' 
                ? 'bg-green-400 text-black' 
                : 'bg-red-400 text-white'
            }`}>
              {property.status === 'available' ? 'Available' : 'Occupied'}
            </div>
            {/* Image Counter - Mobile: Always visible with icon + count */}
            <div className="flex xl:hidden absolute bottom-1 left-1 px-2 py-1 rounded-md flex items-center space-x-0.5 text-white text-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image size={16} className="w-4 h-4" />
              <span>{property.images.length}</span>
            </div>
            {/* Image Counter - Desktop: With hover behavior */}
            <div className="hidden xl:flex absolute bottom-0.5 left-1 lg:bottom-2.5 lg:left-1 text-white text-sm xl:text-base px-3 py-2 xl:px-3.5 xl:py-2 rounded-lg shadow-lg items-center space-x-0.5 xl:space-x-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              {!isArrowHovered && (
                <>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image size={16} className="w-4 h-4 xl:w-4.5 xl:h-4.5" />
                </>
              )}
              <span className="font-medium">
                {isArrowHovered 
                  ? (property.images.length === 0 ? '0 / 0' : `${previewImageIndex + 1} / ${property.images.length}`)
                  : property.images.length
                }
              </span>
            </div>
            
            {showEditImageIcon && onEditImageClick && null}
            
            {!hideBookmark && (
              <div 
                className="absolute top-1 right-1 px-2 py-1 xl:px-3 xl:py-1.5 rounded-md flex items-center justify-center text-white text-sm xl:text-base cursor-pointer z-20" 
                style={{ 
                  backgroundColor: showMinusIcon ? '#ef4444' : 'rgba(0, 0, 0, 0.5)'
                }}
                onMouseEnter={(e) => {
                  if (showMinusIcon) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#fca5a5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (showMinusIcon) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#ef4444';
                  }
                }}
                onClick={handleBookmarkClick}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {showMinusIcon ? (
                  <span 
                    className="text-xl xl:text-2xl font-bold w-6 h-6 xl:w-7 xl:h-7 flex items-center justify-center"
                    style={{ 
                      transform: 'scaleX(1.3)', 
                      userSelect: 'none',
                      color: 'white',
                      lineHeight: '1'
                    }}
                  >
                    −
                  </span>
                ) : (
                  <Heart 
                    size={24} 
                    className="w-6 h-6 xl:w-7 xl:h-7" 
                    style={{ 
                      color: bookmarked ? 'white' : 'white', 
                      fill: bookmarked ? '#ef4444' : 'none',
                      strokeWidth: bookmarked ? 1.5 : 1.5
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="flex-1 pt-0 pb-1.5 px-1.5 sm:pt-0 sm:pb-3 sm:px-3 md:pt-0 md:pb-4 md:px-4 lg:pt-0 lg:pb-6 lg:px-6 min-w-0 overflow-hidden cursor-pointer" onClick={handleDetailsClick}>
            <div className="flex flex-col mb-2 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-0 truncate flex items-center gap-1 min-w-0">
                <span className="truncate">{property.title}</span>
                {property.id === lastViewedId && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5 flex-shrink-0"></span>
                )}
              </h3>
                <div className="text-base sm:text-lg text-gray-600 mb-0 truncate">
                  <span className="font-bold">Price:</span> {formatPrice(property.price)}/month
                </div>
              <div className="text-base sm:text-lg text-gray-600 mb-0 truncate">
                <span className="font-bold">Plan:</span> {property.plan} Months
              </div>
              {/* Uploader Information - Admin/Staff Only */}
              {(user?.role === 'admin' || (user?.role === 'staff' && user?.isApproved)) && (
                <div className="text-base sm:text-lg text-gray-600 mb-0 truncate">
                  {hideBookmark && ('ownerId' in property && property.ownerId === user?.id) ? (
                    // On my-properties page: show only type with braces
                    <span><span className="font-bold">Uploader:</span> {property.uploaderType ? `(${property.uploaderType})` : ''}</span>
                  ) : (
                    // On homepage: show name and type
                    ('ownerName' in property && property.ownerName) && (
                      <span><span className="font-bold">Uploader:</span> {property.ownerName.split(' ')[0]}{property.uploaderType ? ` (${property.uploaderType})` : ''}</span>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="text-sm sm:text-base text-gray-900 mb-0.5 bg-yellow-200 px-1 py-0 rounded w-fit max-w-full -mt-1 flex items-center justify-center border border-black min-w-0 overflow-hidden">
              <MapPin size={12} className="mr-1 flex-shrink-0" />
              <span className="truncate min-w-0">{property.location}</span>
            </div>
            <div className="text-sm sm:text-base text-gray-500 mb-1 flex items-center ml-1 min-w-0 overflow-hidden">
              <Clock size={14} className="mr-0.5 flex-shrink-0" />
              <span className="truncate">Updated: {getRelativeTime(property.updatedAt)}</span>
            </div>
            {hideBookmark && (onStatusChange || onEditClick || onEditImageClick) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onManageStart) {
                    onManageStart();
                  }
                  setShowActionPopup(true);
                  setPendingStatus(property.status);
                  setPendingImages(false);
                  setPendingDetails(false);
                }}
                className="mt-1 w-2/3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded transition-colors flex items-center justify-start gap-2 whitespace-nowrap"
                title="Edit this property"
              >
                Edit this property
                <Pencil size={15} />
              </button>
            )}
            {/* Removed inline share button on landing; moved to details popup */}
          </div>
        </div>
      </div>

      {/* Share Popup */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        shareOptions={{
          property: {
            id: property.id,
            title: property.title,
            price: property.price,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            images: property.images,
            description: property.description,
            propertyType: 'propertyType' in property ? property.propertyType : undefined
          }
        }}
      />

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
          onImageChange={setCurrentImageIndex}
          onViewDetails={() => {
            setIsLightboxOpen(false);
            // Coming from image lightbox - preserve current image position
            setIsFromHomescreen(false);
            setIsDetailsOpen(true);
          }}
        />
      )}

      {/* Property Details Popup */}
      {isDetailsOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden', touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            // Only close on desktop when clicking the backdrop
            if (window.innerWidth >= 1280 && e.target === e.currentTarget) {
              setIsDetailsOpen(false);
            } else {
              e.stopPropagation();
            }
          }}
        >
           <div 
             className="rounded-xl max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full max-h-[90vh] sm:max-h-[90vh] max-h-[40vh] shadow-lg flex flex-col overflow-hidden xl:max-w-2xl xl:w-auto"
             style={{ backgroundColor: '#0071c2' }}
             onClick={(e: React.MouseEvent) => e.stopPropagation()}
           >
             {/* Header */}
             <div className="sticky top-0 flex items-center justify-center p-2 xl:p-3 z-10 flex-shrink-0" style={{ backgroundColor: '#0071c2' }}>
               <h2 
                 ref={headerRef}
                 className="font-semibold text-white px-4 whitespace-nowrap"
                 style={{ fontSize: `${headerFontSize}px`, lineHeight: '1.2' }}
               >
                 {'propertyType' in property ? formatPropertyType(property.propertyType) : 'Property'}
               </h2>
             </div>

             {/* Content - Scrollable */}
             <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-1 px-6 pb-6 xl:pt-4 xl:px-10 xl:pb-8">
               <div className="space-y-6 xl:space-y-8">
                 {/* Property Information - Same as Homepage */}
                 <div className="space-y-2 xl:space-y-3 xl:text-center">
                   {/* Status */}
                   <div className="text-lg xl:text-xl text-white xl:flex xl:items-center xl:justify-center">
                     <span className="font-bold">Status:</span> 
                     <span className={`ml-2 xl:ml-3 px-3 xl:px-4 py-1 xl:py-1.5 rounded text-sm xl:text-base font-medium border-[1.5px] border-black ${
                       property.status === 'available' 
                         ? 'bg-green-400 text-black' 
                         : 'bg-red-400 text-white'
                     }`}>
                       {property.status === 'available' ? 'Available' : 'Occupied'}
                     </span>
                   </div>
                   <div className="text-lg xl:text-xl text-white">
                     <span className="font-bold">Price:</span> <span className="ml-1">{formatPrice(property.price)}/month</span>
                   </div>
                   <div className="text-lg xl:text-xl text-white">
                     <span className="font-bold">Plan:</span> <span className="ml-1">{property.plan} Months</span>
                   </div>
                   <div className="text-sm xl:text-base text-black bg-yellow-200 px-3 xl:px-4 py-1 xl:py-1.5 rounded w-fit flex items-center justify-center border border-black xl:mx-auto">
                     <MapPin size={12} className="xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                     <span>{property.location}</span>
                   </div>
                   <div className="text-sm xl:text-base text-white/80 flex items-center xl:justify-center">
                     <Clock size={12} className="xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                     <span>Updated: {getRelativeTime(property.updatedAt)}</span>
                   </div>
                   {/* Uploaded By - Admin/Staff Only */}
                   {(user?.role === 'admin' || (user?.role === 'staff' && user?.isApproved)) && (
                     <>
                       {hideBookmark && ('ownerId' in property && property.ownerId === user?.id) ? (
                         // On my-properties page: show only type with braces
                         property.uploaderType && (
                           <div className="text-lg xl:text-xl text-white">
                             <span className="font-bold">Uploader:</span> <span className="ml-1">({property.uploaderType})</span>
                           </div>
                         )
                       ) : (
                         // On homepage: show name and email
                         (('ownerName' in property && property.ownerName) || ('ownerEmail' in property && property.ownerEmail)) && (
                           <>
                             {'ownerName' in property && property.ownerName && (
                               <div className="text-lg xl:text-xl text-white">
                                 <span className="font-bold">Uploaded by:</span> <span className="ml-1">{property.ownerName}</span>
                               </div>
                             )}
                             {'ownerEmail' in property && property.ownerEmail && (
                               <div className="text-lg xl:text-xl text-white">
                                 <span className="font-bold">Email:</span> <span className="ml-1">{property.ownerEmail}</span>
                               </div>
                             )}
                           </>
                         )
                       )}
                     </>
                   )}
                 </div>

                 {/* Contact Information - Only show if available */}
                 {(property.contactName || property.contactPhone || property.contactEmail) && (
                   <div className="mt-6 xl:mt-8">
                     <h3 className="text-lg xl:text-xl font-semibold text-white mb-3 xl:mb-4 text-center">Contact Information</h3>
                     <div className="space-y-3 xl:space-y-4 text-center">
                       {property.contactName && (
                         <div className="text-white/90 xl:text-lg">
                           <strong>Contact:</strong> <span className="ml-1">{property.contactName}</span>
                         </div>
                       )}
                       {property.contactPhone && (
                         <div className="text-white/90 xl:text-lg">
                           <strong>Phone:</strong> <span className="ml-1">{property.contactPhone}</span>
                         </div>
                       )}
                       {property.contactEmail && (
                         <div className="text-white/90 xl:text-lg">
                           <strong>Email:</strong> <span className="ml-1">{property.contactEmail}</span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}

               </div>
             </div>

             {/* Show Images Button - Fixed at Bottom */}
             <div className="flex justify-center items-center pt-1 pb-2 px-4 xl:pt-2 xl:pb-3 flex-shrink-0">
               <div className="w-3/4 xl:w-2/3 h-0.5 bg-yellow-500 mb-1"></div>
             </div>
            <div className="flex justify-center items-center pb-2 px-4 xl:pb-4 xl:px-6 flex-shrink-0 gap-2 xl:gap-3">
              {/* Share Button moved into details popup and placed first */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShareClick(e);
                }}
                className={`text-white transition-colors rounded-lg px-4 py-2 xl:px-5 xl:py-2.5 cursor-pointer flex items-center justify-center gap-2 ${isShareSpinning ? 'rotate-[10deg]' : ''}`}
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.9)' /* green-500 */
                }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.9)'}
              >
                <Share2 size={16} className="xl:w-5 xl:h-5" />
                <span className="text-sm xl:text-base font-medium" style={{ pointerEvents: 'none' }}>Share</span>
              </button>
               <button
                 onClick={() => {
                   // Save current scroll position before closing popup
                   if (scrollContainerRef.current) {
                     setSavedScrollPosition(scrollContainerRef.current.scrollTop);
                   }
                   setIsDetailsOpen(false);
                   // If coming from homescreen, start from first image, otherwise preserve position
                   if (isFromHomescreen) {
                     setCurrentImageIndex(0);
                     setIsFromHomescreen(false);
                   }
                   setIsLightboxOpen(true);
                 }}
                 className="text-white transition-colors rounded-lg px-4 py-2 xl:px-5 xl:py-2.5 cursor-pointer flex items-center justify-center"
                 style={{ 
                   backgroundColor: 'rgba(0, 0, 0, 0.5)'
                 }}
                 onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(59, 130, 246, 1)'}
                 onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
               >
                 <span className="text-sm xl:text-base font-medium" style={{ pointerEvents: 'none' }}>Show images</span>
               </button>
               
               {/* Close Button */}
               <button
                 onClick={() => setIsDetailsOpen(false)}
                className="text-white transition-colors rounded-lg px-8 py-2 xl:px-10 xl:py-2.5 cursor-pointer flex items-center justify-center"
                 style={{ 
                   backgroundColor: 'rgba(239, 68, 68, 0.8)'
                 }}
                 onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                 onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
               >
                 <span className="text-sm xl:text-base font-medium" style={{ pointerEvents: 'none' }}>Close</span>
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Bookmark Popup */}
      {showBookmarkPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden', touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => {
            // Only close on desktop when clicking the backdrop
            if (window.innerWidth >= 1280 && e.target === e.currentTarget) {
              setShowBookmarkPopup(false);
            } else {
              e.stopPropagation();
            }
          }}
        >
          <div 
            className="rounded-lg max-w-sm w-full p-6 shadow-lg"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2 px-4" style={{ borderBottom: '2px solid #eab308' }}>Save this Property</h3>
                <p className="text-white/80 text-sm">Are you sure you want to save this property to your bookmarks?</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveProperty}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelBookmark}
                  className="flex-1 bg-red-400/75 hover:bg-red-500/75 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Bookmark Popup */}
      {showRemoveBookmarkPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden', touchAction: 'none', minHeight: '100vh', height: '100%' }}
          onClick={(e) => {
            // Only close on desktop when clicking the backdrop
            if (window.innerWidth >= 1280 && e.target === e.currentTarget) {
              setShowRemoveBookmarkPopup(false);
            } else {
              e.stopPropagation();
            }
          }}
        >
          <div 
            className="rounded-lg max-w-sm w-full p-6 shadow-lg"
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
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemoveBookmark}
                  className="flex-1 bg-red-400/75 hover:bg-red-500/75 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Selection Popup */}
      {showActionPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-lg w-full max-w-sm mx-auto p-6 shadow-lg"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="space-y-3">
              {onStatusChange && (
                <div className="flex items-center justify-center">
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-gray-800 text-sm font-medium">
                      <span className="text-sm text-gray-600">[{(pendingStatus || property.status).replace(/^./, (c) => c.toUpperCase())}]</span>
                      <span>Change status</span>
                      <Radio size={15} />
                    </div>
                    <select
                      value={pendingStatus || property.status}
                      onChange={(e) => {
                        const value = e.target.value as 'available' | 'occupied' | '';
                        if (!value) return;
                        setPendingStatus(value);
                      }}
                      className="w-full appearance-none bg-white/90 text-transparent text-sm py-3 rounded-lg focus:outline-none cursor-pointer"
                      style={{ color: 'transparent' }}
                    >
                      <option value="" style={{ color: '#111827' }}>---</option>
                      <option value="available" style={{ color: '#111827' }}>Available</option>
                      <option value="occupied" style={{ color: '#111827' }}>Occupied</option>
                    </select>
                  </div>
                </div>
              )}
              {onEditImageClick && (
                <button
                  onClick={() => {
                    setPendingImages(true);
                    onEditImageClick();
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ border: '1px solid #eab308' }}
                >
                  Change images ({stagedImageCount !== undefined ? stagedImageCount : property.images.length})
                </button>
              )}
              {onEditClick && (
                <button
                  onClick={() => {
                    setPendingDetails(true);
                    onEditClick();
                  }}
                  className="w-full bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ border: '1px solid #eab308' }}
                >
                  Edit details
                  <Pencil size={15} />
                </button>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    // Apply staged changes if pendingDetails or pendingImages is true
                    if ((pendingDetails || pendingImages) && onApplyStagedChanges) {
                      onApplyStagedChanges();
                    }
                    if (pendingStatus !== property.status && onStatusChange) {
                      onStatusChange(pendingStatus as 'available' | 'occupied');
                    }
                    setShowActionPopup(false);
                    setPendingImages(false);
                    setPendingDetails(false);
                    showSuccessMessage();
                  }}
                  disabled={isSubmitDisabled}
                  className={`w-1/2 text-sm px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-white ${
                    isSubmitDisabled
                      ? 'bg-green-500 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowActionPopup(false);
                    setPendingStatus(property.status);
                    setPendingImages(false);
                    setPendingDetails(false);
                  }}
                  className="w-1/2 text-white text-sm px-4 py-3 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
