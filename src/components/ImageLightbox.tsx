'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onImageChange: (index: number) => void;
}

export default function ImageLightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onImageChange 
}: ImageLightboxProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const preloadedImagesRef = useRef<Set<number>>(new Set());

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onImageChange(newIndex);
  }, [currentIndex, images.length, onImageChange]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onImageChange(newIndex);
  }, [currentIndex, images.length, onImageChange]);

  // Preload images function
  const preloadImage = useCallback((index: number) => {
    if (preloadedImagesRef.current.has(index)) return;
    
    const img = new window.Image();
    img.onload = () => {
      preloadedImagesRef.current.add(index);
      setPreloadedImages(new Set(preloadedImagesRef.current));
    };
    img.onerror = () => {
      // Still mark as "loaded" but we'll handle the error in the display
      preloadedImagesRef.current.add(index);
      setPreloadedImages(new Set(preloadedImagesRef.current));
    };
    img.src = images[index];
  }, [images]);

  // Preload current and adjacent images
  useEffect(() => {
    // Reset loading and error states when image changes
    setIsLoading(true);
    setImageError(false);
    
    // Preload current image
    preloadImage(currentIndex);
    
    // Preload next image
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    preloadImage(nextIndex);
    
    // Preload previous image
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    preloadImage(prevIndex);
  }, [currentIndex, images.length, preloadImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore body scroll when lightbox is closed
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex, onClose, goToPrevious, goToNext]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Check if current image is preloaded
  const isCurrentImagePreloaded = preloadedImages.has(currentIndex);

  // Touch gesture handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Click/tap gesture handlers
  const handleImageClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const imageWidth = rect.width;
    const middleX = imageWidth / 2;

    if (clickX > middleX) {
      // Clicked on the right side - go to next image
      goToNext();
    } else {
      // Clicked on the left side - go to previous image
      goToPrevious();
    }
  };

  return (
         <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">

      {/* Navigation Arrows - Desktop Only */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={goToNext}
            className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight size={48} />
          </button>
        </>
      )}

             {/* Image */}
             <div 
               className="relative max-w-4xl max-h-[90vh] mx-4 cursor-pointer"
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}
               onClick={handleImageClick}
             >
               {/* Close Button - Inside Image at Top Edge */}
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors z-20 rounded-lg p-2 cursor-pointer"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                 <X size={24} />
               </button>

               {isLoading && !isCurrentImagePreloaded && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-white text-lg">Loading...</div>
                 </div>
               )}
               {imageError || !images[currentIndex] ? (
                 <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center min-h-[400px]">
                   <img
                     src="/icon.png"
                     alt="Rentapp Logo"
                     className="w-24 h-24 mb-4 opacity-60"
                   />
                   <div className="text-blue-600 text-lg font-medium">Rentapp</div>
                   <div className="text-blue-500 text-sm mt-2">Image not available</div>
                 </div>
               ) : (
                 <img
                   src={images[currentIndex]}
                   alt={`Property image ${currentIndex + 1}`}
                   className="max-w-full max-h-full object-contain"
                   onLoad={handleImageLoad}
                   onError={handleImageError}
                   style={{ 
                     opacity: isCurrentImagePreloaded ? 1 : 0.7,
                     transition: 'opacity 0.3s ease-in-out'
                   }}
                 />
               )}
        
               {/* Image Counter */}
               {images.length > 1 && (
                  <div className="absolute bottom-1 left-1 lg:bottom-1 lg:left-1 text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center border border-gray-600" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                   <span className="font-medium">{currentIndex + 1} / {images.length}</span>
                 </div>
               )}
      </div>

    </div>
  );
}
