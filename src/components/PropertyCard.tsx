'use client';

import { useState } from 'react';
import { MapPin, Bed, Bath, Square, Image } from 'lucide-react';
import { Property } from '@/data/properties';
import ImageLightbox from './ImageLightbox';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
          <div className="w-32 sm:w-40 md:w-56 lg:w-80 h-32 sm:h-40 md:h-56 lg:h-64 flex-shrink-0 relative">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleImageClick}
            />
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Image size={12} />
              <span>{property.images.length}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 min-w-0">
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
