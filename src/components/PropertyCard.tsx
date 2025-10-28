'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Image, X, Clock, Bookmark } from 'lucide-react';
import { Property } from '@/data/properties';
import ImageLightbox from './ImageLightbox';
import SharePopup from './SharePopup';

interface PropertyCardProps {
  property: Property;
  onBookmarkClick?: () => void;
}

export default function PropertyCard({ property, onBookmarkClick }: PropertyCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFromHomescreen, setIsFromHomescreen] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isShareSpinning, setIsShareSpinning] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const [showBookmarkPopup, setShowBookmarkPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const preloadedImagesRef = useRef<Set<number>>(new Set());

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

  // Prevent body scrolling when popup is open
  useEffect(() => {
    if (isDetailsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDetailsOpen]);

  // Prevent body scrolling when share popup is open
  useEffect(() => {
    if (showSharePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSharePopup]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price).replace('TZS', 'Tshs');
  };

  const handleImageClick = () => {
    setIsLightboxOpen(true);
    setCurrentImageIndex(0);
    // Mark as viewed when image is clicked
    setIsViewed(true);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Coming from homescreen - reset to first image and clear scroll position
    setIsFromHomescreen(true);
    setCurrentImageIndex(0);
    setSavedScrollPosition(0); // Reset scroll position to top
    setIsDetailsOpen(true);
    // Mark as viewed when details are opened
    setIsViewed(true);
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
    } else {
      setShowBookmarkPopup(true);
      // Prevent page scrolling
      document.body.style.overflow = 'hidden';
    }
  };

  const handleSaveProperty = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add save functionality here
    setShowBookmarkPopup(false);
    // Restore page scrolling
    document.body.style.overflow = 'unset';
  };

  const handleCancelBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowBookmarkPopup(false);
    // Restore page scrolling
    document.body.style.overflow = 'unset';
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const updatedAt = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);

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

  return (
    <>
      <div className={`bg-white rounded-lg transition-shadow duration-200 overflow-hidden ${
        isViewed 
          ? 'border-[3px] border-blue-300 shadow-md' 
          : 'border border-gray-200 shadow-sm hover:shadow-md'
      }`}>
        <div className="flex flex-row min-w-0">
          {/* Property Image */}
          <div className="w-36 sm:w-44 md:w-56 lg:w-80 h-36 sm:h-44 md:h-56 lg:h-64 flex-shrink-0 relative">
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
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
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleImageClick}
                onError={() => setImageError(true)}
                style={{ 
                  opacity: isImageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out'
                }}
              />
            )}
            {/* Status Banner */}
            <div className={`absolute top-1 left-1 px-2 py-0.5 rounded text-xs font-medium border-[1.5px] border-black ${
              property.status === 'available' 
                ? 'bg-green-400 text-black' 
                : 'bg-red-400 text-white'
            }`}>
              {property.status === 'available' ? 'Available' : 'Occupied'}
            </div>
            <div className="absolute bottom-1 left-1 px-2 py-1 rounded-md flex items-center space-x-0.5 text-white text-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image size={16} className="w-4 h-4" />
              <span>{property.images.length}</span>
            </div>
            <div 
              className="absolute bottom-1 right-1 px-2 py-1.5 rounded-md flex items-center justify-center text-white text-sm cursor-pointer" 
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={handleBookmarkClick}
            >
              <Bookmark size={16} className="w-4 h-4" />
            </div>
          </div>

          {/* Property Details */}
          <div className="flex-1 p-1.5 sm:p-3 md:p-4 lg:p-6 min-w-0 cursor-pointer" onClick={handleDetailsClick}>
            <div className="flex flex-col mb-2">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-0 truncate">
                {property.title}
              </h3>
                <div className="text-sm text-gray-600 mb-0">
                  <span className="font-bold">Price:</span> {formatPrice(property.price)}/month
                </div>
              <div className="text-sm text-gray-600 mb-0">
                <span className="font-bold">Plan:</span> {property.plan} Months
              </div>
            </div>

            <div className="text-xs text-gray-900 mb-0.5 bg-yellow-200 px-1 py-0 rounded w-fit -mt-1 flex items-center justify-center border border-black">
              <MapPin size={10} className="mr-1 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1 flex items-baseline ml-1">
              <Clock size={10} className="mr-0.5 flex-shrink-0" style={{ transform: 'translateY(0.25px)' }} />
              <span>Updated: {getRelativeTime(property.updatedAt)}</span>
            </div>
            <button
              onClick={handleShareClick}
              className={`bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded ml-0.5 ${isShareSpinning ? 'rotate-[10deg]' : ''}`}
            >
              Share this property
            </button>
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
            description: property.description
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
          style={{ overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
           <div 
             className="rounded-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[90vh] max-h-[40vh] shadow-lg flex flex-col overflow-hidden"
             style={{ backgroundColor: '#0071c2' }}
             onClick={(e: React.MouseEvent) => e.stopPropagation()}
           >
             {/* Header */}
             <div className="sticky top-0 flex items-center justify-center p-2 z-10 flex-shrink-0 relative" style={{ backgroundColor: '#0071c2' }}>
               <h2 className="text-xl font-semibold text-white px-4" style={{ borderBottom: '2px solid #eab308' }}>Property Details</h2>
               <button
                 onClick={() => setIsDetailsOpen(false)}
                 className="absolute right-2 text-white transition-colors rounded-lg p-2 cursor-pointer"
                 style={{ 
                   backgroundColor: 'rgba(0, 0, 0, 0.5)'
                 }}
                 onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                 onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
               >
                 <X size={20} />
               </button>
             </div>

             {/* Content - Scrollable */}
             <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-4 px-6 pb-6">
               <div className="space-y-6">
                   {/* Property Title */}
                   <div className="mb-1">
                     <h2 className="text-2xl font-bold text-white">{property.title}</h2>
                   </div>

                 {/* Property Information - Same as Homepage */}
                 <div className="space-y-2">
                   {/* Status */}
                   <div className="text-lg text-white">
                     <span className="font-bold">Status:</span> 
                     <span className={`ml-2 px-3 py-1 rounded text-sm font-medium border-[1.5px] border-black ${
                       property.status === 'available' 
                         ? 'bg-green-400 text-black' 
                         : 'bg-red-400 text-white'
                     }`}>
                       {property.status === 'available' ? 'Available' : 'Occupied'}
                     </span>
                   </div>
                   <div className="text-lg text-white">
                     <span className="font-bold">Price:</span> {formatPrice(property.price)}/month
                   </div>
                   <div className="text-lg text-white">
                     <span className="font-bold">Plan:</span> {property.plan} Months
                   </div>
                   <div className="text-sm text-black bg-yellow-200 px-3 py-1 rounded w-fit flex items-center justify-center border border-black">
                     <MapPin size={12} className="mr-1 flex-shrink-0" />
                     <span>{property.location}</span>
                   </div>
                   <div className="text-sm text-white/80 flex items-center">
                     <Clock size={12} className="mr-1 flex-shrink-0" />
                     <span>Updated: {getRelativeTime(property.updatedAt)}</span>
                   </div>
                 </div>

                 {/* Contact Information - Only show if available */}
                 {(property.contactName || property.contactPhone || property.contactEmail) && (
                   <div className="mt-6">
                     <h3 className="text-lg font-semibold text-white mb-3 text-center">Contact Information</h3>
                     <div className="space-y-3 text-center">
                       {property.contactName && (
                         <div className="text-white/90">
                           <strong>Contact:</strong> {property.contactName}
                         </div>
                       )}
                       {property.contactPhone && (
                         <div className="text-white/90">
                           <strong>Phone:</strong> {property.contactPhone}
                         </div>
                       )}
                       {property.contactEmail && (
                         <div className="text-white/90">
                           <strong>Email:</strong> {property.contactEmail}
                         </div>
                       )}
                     </div>
                   </div>
                 )}

               </div>
             </div>

             {/* Show Images Button - Fixed at Bottom */}
             <div className="flex justify-center items-center pt-1 pb-2 px-4 flex-shrink-0">
               <div className="w-3/4 h-0.5 bg-yellow-500 mb-1"></div>
             </div>
             <div className="flex justify-center items-center pb-2 px-4 flex-shrink-0">
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
                 className="text-white transition-colors rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center"
                 style={{ 
                   backgroundColor: 'rgba(0, 0, 0, 0.5)'
                 }}
                 onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(59, 130, 246, 1)'}
                 onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
               >
                 <span className="text-sm font-medium" style={{ pointerEvents: 'none' }}>Show images</span>
               </button>
               
               {/* Close Button */}
               <button
                 onClick={() => setIsDetailsOpen(false)}
                 className="text-white transition-colors rounded-lg px-8 py-2 cursor-pointer flex items-center justify-center ml-2"
                 style={{ 
                   backgroundColor: 'rgba(239, 68, 68, 0.8)'
                 }}
                 onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                 onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 0.8)'}
               >
                 <span className="text-sm font-medium" style={{ pointerEvents: 'none' }}>Close</span>
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Bookmark Popup */}
      {showBookmarkPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{ overflow: 'hidden' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="rounded-lg max-w-sm w-full p-6 shadow-lg"
            style={{ backgroundColor: '#0071c2' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-4">
                <Bookmark size={48} className="mx-auto text-white mb-2" />
                <h3 className="text-lg font-semibold text-white mb-2 px-4" style={{ borderBottom: '2px solid #eab308' }}>Save this Property</h3>
                <p className="text-white/80 text-sm">Do you want to save this property to your bookmarks?</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelBookmark}
                  className="flex-1 bg-red-400/75 hover:bg-red-500/75 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  No
                </button>
                <button
                  onClick={handleSaveProperty}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
