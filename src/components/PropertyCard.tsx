'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Bed, Bath, Square, Image } from 'lucide-react';
import { Property } from '@/data/properties';
import ImageLightbox from './ImageLightbox';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const preloadedImagesRef = useRef<Set<number>>(new Set());

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleImageClick = () => {
    setIsLightboxOpen(true);
    setCurrentImageIndex(0);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
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
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 shadow-lg">
                    <img
                      src="/icon.png"
                      alt="Rentapp Logo"
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="text-white text-lg font-bold mb-1">Rentapp</div>
                  <div className="text-blue-100 text-sm">Premium Properties</div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-4 w-4 h-4 bg-white/20 rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-white/15 rounded-full"></div>
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white/10 rounded-full"></div>
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
            <div className="absolute bottom-1 left-1 text-white text-xs px-2 py-1 rounded flex items-center space-x-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <Image size={12} />
              <span>{property.images.length}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex-1 p-1.5 sm:p-3 md:p-4 lg:p-6 min-w-0">
            <div className="flex flex-col mb-2">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 truncate">
                {property.title}
              </h3>
              <div className="text-left">
                <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-booking-blue">
                  {formatPrice(property.price)}
                </div>
                <div className="text-xs text-gray-500">per month</div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-1">
              <MapPin size={12} className="mr-1 flex-shrink-0" />
              <span className="text-xs truncate">{property.location}</span>
            </div>

            <p className="text-gray-700 mb-2 text-xs overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical'}}>
              {property.description}
            </p>

            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <div className="flex items-center">
                <Bed size={12} className="mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath size={12} className="mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square size={12} className="mr-1" />
                <span>{property.area}m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
          onImageChange={setCurrentImageIndex}
        />
      )}
    </>
  );
}
