'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Bed, Bath, Square, Image, X, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { Property } from '@/data/properties';
import ImageLightbox from './ImageLightbox';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFromHomescreen, setIsFromHomescreen] = useState(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    // Coming from homescreen - reset to first image and clear scroll position
    setIsFromHomescreen(true);
    setCurrentImageIndex(0);
    setSavedScrollPosition(0); // Reset scroll position to top
    setIsDetailsOpen(true);
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
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
                    <img
                      src="/icon.png"
                      alt="Rentapp Logo"
                      className="w-16 h-16 rounded-lg"
                    />
                  </div>
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
            <div className="absolute bottom-1 left-1 text-white text-xs sm:text-base px-2 py-1 rounded flex items-baseline justify-center space-x-0.5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <Image size={14} className="flex-shrink-0 sm:w-5 sm:h-5" style={{ transform: 'translateY(2px)' }} />
              <span className="flex-shrink-0 font-medium sm:transform sm:translate-y-[-1.5px]">{property.images.length}</span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex-1 p-1.5 sm:p-3 md:p-4 lg:p-6 min-w-0 cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={handleDetailsClick}>
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
          onClick={() => setIsDetailsOpen(false)}
        >
           <div 
             className="bg-blue-100 rounded-lg max-w-4xl w-full max-h-[90vh] sm:max-h-[90vh] max-h-[40vh] border-2 sm:border-2 border-3 border-yellow-500 shadow-lg flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Header */}
             <div className="sticky top-0 bg-blue-100 flex items-center justify-between p-2 border-b-2 sm:border-b-2 border-b-3 border-yellow-500 z-10 flex-shrink-0">
               <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
               <button
                 onClick={() => setIsDetailsOpen(false)}
                 className="text-white transition-colors rounded-lg p-2 cursor-pointer"
                 style={{ 
                   backgroundColor: 'rgba(0, 0, 0, 0.5)',
                   '--hover-bg': 'rgba(239, 68, 68, 1)'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
               >
                 <X size={20} />
               </button>
             </div>

             {/* Content - Scrollable */}
             <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6">
               <div className="space-y-6">
                 {/* Property Description */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                   <p className="text-gray-700 leading-relaxed">{property.description}</p>
                   <p className="text-gray-700 leading-relaxed mt-3">
                     This beautiful property offers modern living with contemporary design elements. The spacious layout provides excellent natural lighting throughout the day, creating a warm and inviting atmosphere. Perfect for families, professionals, or anyone seeking comfort and convenience in a prime location.
                   </p>
                 </div>

                 {/* Property Features */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Features</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                       <div className="flex items-center space-x-3">
                         <Bed size={18} className="text-booking-blue" />
                         <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
                       </div>
                       <div className="flex items-center space-x-3">
                         <Bath size={18} className="text-booking-blue" />
                         <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
                       </div>
                       <div className="flex items-center space-x-3">
                         <Square size={18} className="text-booking-blue" />
                         <span className="text-gray-700">{property.area} m²</span>
                       </div>
                     </div>
                     <div className="space-y-3">
                       <div className="flex items-center space-x-3">
                         <MapPin size={18} className="text-booking-blue" />
                         <span className="text-gray-700">{property.location}</span>
                       </div>
                       <div className="flex items-center space-x-3">
                         <Calendar size={18} className="text-booking-blue" />
                         <span className="text-gray-700">Available Now</span>
                       </div>
                       <div className="flex items-center space-x-3">
                         <span className="text-gray-700">Property Type: Apartment</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Amenities */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities & Features</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <div className="text-gray-700">✓ Air Conditioning</div>
                       <div className="text-gray-700">✓ Parking Space</div>
                       <div className="text-gray-700">✓ Security System</div>
                       <div className="text-gray-700">✓ Internet Ready</div>
                       <div className="text-gray-700">✓ Balcony</div>
                       <div className="text-gray-700">✓ Elevator</div>
                     </div>
                     <div className="space-y-2">
                       <div className="text-gray-700">✓ Swimming Pool</div>
                       <div className="text-gray-700">✓ Gym</div>
                       <div className="text-gray-700">✓ Garden</div>
                       <div className="text-gray-700">✓ Pet Friendly</div>
                       <div className="text-gray-700">✓ Laundry Room</div>
                       <div className="text-gray-700">✓ Storage Space</div>
                     </div>
                   </div>
                 </div>

                 {/* Location Details */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Transportation</h3>
                   <div className="space-y-3">
                     <div className="text-gray-700">
                       <strong>Distance to City Center:</strong> 5 minutes drive
                     </div>
                     <div className="text-gray-700">
                       <strong>Nearest Bus Stop:</strong> 200 meters
                     </div>
                     <div className="text-gray-700">
                       <strong>Nearest Shopping Mall:</strong> 1.2 km
                     </div>
                     <div className="text-gray-700">
                       <strong>Nearest Hospital:</strong> 3.5 km
                     </div>
                     <div className="text-gray-700">
                       <strong>Nearest School:</strong> 800 meters
                     </div>
                     <div className="text-gray-700">
                       <strong>Nearest Airport:</strong> 25 km
                     </div>
                   </div>
                 </div>

                 {/* Rental Terms */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Rental Terms & Conditions</h3>
                   <div className="space-y-3">
                     <div className="text-gray-700">
                       <strong>Minimum Lease:</strong> 12 months
                     </div>
                     <div className="text-gray-700">
                       <strong>Security Deposit:</strong> 2 months rent
                     </div>
                     <div className="text-gray-700">
                       <strong>Utilities:</strong> Not included in rent
                     </div>
                     <div className="text-gray-700">
                       <strong>Pet Policy:</strong> Small pets allowed with additional deposit
                     </div>
                     <div className="text-gray-700">
                       <strong>Maintenance:</strong> Landlord responsible for major repairs
                     </div>
                     <div className="text-gray-700">
                       <strong>Notice Period:</strong> 30 days for lease termination
                     </div>
                   </div>
                 </div>

                 {/* Contact Information */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                   <div className="space-y-3">
                     <div className="text-gray-700">
                       <strong>Property Manager:</strong> John Smith
                     </div>
                     <div className="text-gray-700">
                       <strong>Phone:</strong> +255 123 456 789
                     </div>
                     <div className="text-gray-700">
                       <strong>Email:</strong> john.smith@rentapp.com
                     </div>
                     <div className="text-gray-700">
                       <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
                     </div>
                     <div className="text-gray-700">
                       <strong>Emergency Contact:</strong> +255 987 654 321
                     </div>
                   </div>
                 </div>

                 {/* Additional Information */}
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                   <div className="space-y-3">
                     <div className="text-gray-700">
                       <strong>Year Built:</strong> 2020
                     </div>
                     <div className="text-gray-700">
                       <strong>Floor:</strong> 3rd Floor
                     </div>
                     <div className="text-gray-700">
                       <strong>Orientation:</strong> South-facing
                     </div>
                     <div className="text-gray-700">
                       <strong>Heating:</strong> Central heating system
                     </div>
                     <div className="text-gray-700">
                       <strong>Cooling:</strong> Air conditioning in all rooms
                     </div>
                     <div className="text-gray-700">
                       <strong>Parking:</strong> 1 covered parking space included
                     </div>
                   </div>
                 </div>

               </div>
             </div>

             {/* Show Images Button - Fixed at Bottom */}
             <div className="flex justify-center items-center pt-1 pb-2 px-4 border-t-2 sm:border-t-2 border-t-3 border-yellow-500 flex-shrink-0">
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
                   backgroundColor: 'rgba(0, 0, 0, 0.5)',
                   '--hover-bg': 'rgba(59, 130, 246, 1)'
                 }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 1)'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
               >
                 <span className="text-sm font-medium" style={{ pointerEvents: 'none' }}>Show images</span>
               </button>
             </div>
           </div>
        </div>
      )}
    </>
  );
}
