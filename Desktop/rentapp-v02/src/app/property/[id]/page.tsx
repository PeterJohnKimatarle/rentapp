'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, Mail, Calendar, Share2, Image as ImageIcon, Clock, Heart, MessageCircle } from 'lucide-react';
import { getAllProperties, DisplayProperty, isBookmarked, addBookmark, removeBookmark } from '@/utils/propertyUtils';
import ImageLightbox from '@/components/ImageLightbox';
import SharePopup from '@/components/SharePopup';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { usePreventScroll } from '@/hooks/usePreventScroll';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;
  const [property, setProperty] = useState<DisplayProperty | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedImageIndex, setDisplayedImageIndex] = useState(0);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingModalType, setBookingModalType] = useState<'book' | 'status'>('book');

  // Prevent body scrolling when booking modal is open
  usePreventScroll(showBookingModal || showSharePopup);

  useEffect(() => {
    const propertyId = params.id as string;
    const allProperties = getAllProperties();
    const foundProperty = allProperties.find(p => p.id === propertyId);
    setProperty(foundProperty || null);
    
    // Dispatch event to mark this property as the last viewed (for blue dot indicator)
    if (foundProperty) {
      // Store in sessionStorage for persistence across component remounts
      sessionStorage.setItem('lastViewedPropertyId', foundProperty.id);
      // Dispatch event to update all PropertyCard components
      const evt = new CustomEvent('lastViewedPropertyChanged', { detail: { id: foundProperty.id } });
      window.dispatchEvent(evt);
    }
  }, [params.id]);

  // Update Open Graph meta tags for WhatsApp preview
  useEffect(() => {
    if (!property) return;

    const propertyUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/property/${property.id}`
      : `/property/${property.id}`;
    
    const mainImageUrl = property.images && property.images.length > 0 
      ? (property.images[0].startsWith('http') 
          ? property.images[0] 
          : typeof window !== 'undefined' 
            ? `${window.location.origin}${property.images[0]}` 
            : property.images[0])
      : '';

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create regular meta tags
    const updateRegularMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Set Open Graph tags
    updateMetaTag('og:title', property.title);
    updateMetaTag('og:description', property.description || `${property.title} - ${property.location}`);
    updateMetaTag('og:image', mainImageUrl);
    updateMetaTag('og:url', propertyUrl);
    updateMetaTag('og:type', 'website');

    // Set Twitter Card tags (for better compatibility)
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', property.title);
    updateMetaTag('twitter:description', property.description || `${property.title} - ${property.location}`);
    updateMetaTag('twitter:image', mainImageUrl);

    // Update page title
    document.title = `${property.title} - Rentapp`;

    // Cleanup function
    return () => {
      // Optionally reset to default title on unmount
      document.title = "Rentapp - Tanzania's #1 Renting Platform";
    };
  }, [property]);

  // Check bookmark status
  useEffect(() => {
    if (!property || !userId) {
      setBookmarked(false);
      return;
    }
    const checkBookmarkStatus = () => {
      setBookmarked(isBookmarked(property.id, userId));
    };
    checkBookmarkStatus();
    const handleBookmarksChanged = () => {
      checkBookmarkStatus();
    };
    window.addEventListener('bookmarksChanged', handleBookmarksChanged);
    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarksChanged);
    };
  }, [property, userId]);

  const handleBookmarkClick = () => {
    if (!property) {
      return;
    }
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
  };

  const formatPrice = (price: number) => {
    const formatted = new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
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
    }
    
    let diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
    }
    
    let diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    let diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    let diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
    
    let diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    let diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
  };

  if (!property) {
    return (
      <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-2">Property Not Found</div>
          <div className="text-gray-600 mb-4">The property you&apos;re looking for doesn&apos;t exist.</div>
          <button
            onClick={() => router.push('/')}
            className="bg-booking-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
      </Layout>
    );
  }

  const mainImage = property.images && property.images.length > 0 ? property.images[displayedImageIndex] : null;
  const otherImages = property.images && property.images.length > 1 ? property.images.slice(1, 5) : [];

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!property.images || property.images.length === 0) return;
    
    if (direction === 'next') {
      setDisplayedImageIndex((prev) => (prev + 1) % property.images!.length);
    } else {
      setDisplayedImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50">
        {/* Property Title */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-3 pb-1.5">
          <div className="rounded-lg py-2" style={{ backgroundColor: '#0071c2' }}>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center">
              {property.title}
            </h1>
          </div>
        </div>

        {/* Hero Image Section */}
        {mainImage && (
          <div className="max-w-7xl mx-auto mt-2 pl-2 pr-2 sm:pl-4 sm:pr-4 lg:pl-6 lg:pr-6">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] overflow-hidden rounded-lg">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(displayedImageIndex);
                setIsLightboxOpen(true);
              }}
            />
            
            {/* Left Click Area - Previous Image */}
            {property.images && property.images.length > 1 && (
              <div 
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('prev');
                }}
              />
            )}
            
            {/* Right Click Area - Next Image */}
            {property.images && property.images.length > 1 && (
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageNavigation('next');
                }}
              />
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 left-2">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 border-black ${
                property.status === 'available' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-red-400 text-white'
              }`}>
                {property.status === 'available' ? 'Available' : 'Occupied'}
              </span>
            </div>

            {/* Share Icon */}
            <div 
              className="absolute top-14 xl:top-16 right-2 px-2 py-1 xl:px-3 xl:py-1.5 rounded-md flex items-center justify-center text-white text-sm xl:text-base cursor-pointer z-20" 
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleShareClick();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Share2 
                size={24} 
                className="w-6 h-6 xl:w-7 xl:h-7" 
                style={{ 
                  color: 'white',
                  strokeWidth: 1.5
                }}
              />
      </div>

            {/* Bookmark Icon */}
            <div 
              className="absolute top-2 right-2 px-2 py-1 xl:px-3 xl:py-1.5 rounded-md flex items-center justify-center text-white text-sm xl:text-base cursor-pointer z-20" 
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }}
              onClick={handleBookmarkClick}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Heart 
                size={24} 
                className="w-6 h-6 xl:w-7 xl:h-7" 
                style={{ 
                  color: 'white', 
                  fill: bookmarked ? '#ef4444' : 'none',
                  strokeWidth: 1.5
                }}
              />
            </div>

            {/* Image Counter - Mobile */}
            {property.images && property.images.length > 0 && (
              <div 
                className="flex xl:hidden absolute bottom-2 left-2 text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center cursor-pointer z-20" 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(displayedImageIndex);
                  setIsLightboxOpen(true);
                }}
              >
                <span className="font-medium">{displayedImageIndex + 1} / {property.images.length}</span>
              </div>
            )}
            {/* Image Counter - Desktop */}
            {property.images && property.images.length > 0 && (
              <div 
                className="hidden xl:flex absolute bottom-2 left-2 text-white text-sm xl:text-base px-3 py-2 xl:px-3.5 xl:py-2 rounded-lg shadow-lg items-center cursor-pointer z-20" 
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(displayedImageIndex);
                  setIsLightboxOpen(true);
                }}
              >
                <span className="font-medium">{displayedImageIndex + 1} / {property.images.length}</span>
              </div>
            )}

            {/* Confirm & Book / Confirm Status Button - Desktop Only */}
            {(!user || (user.role !== 'admin' && user.role !== 'staff')) && (
              <div className="hidden xl:block absolute bottom-2 right-2 z-30">
                {property.status === 'available' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingModalType('book');
                      setShowBookingModal(true);
                    }}
                    className="text-white transition-colors rounded-lg px-4 py-2 xl:px-6 xl:py-3 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    style={{ 
                      backgroundColor: 'rgba(34, 197, 94, 0.9)'
                    }}
                    onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}
                    onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.9)'}
                  >
                    <span className="text-sm xl:text-base font-medium">Confirm & Book</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookingModalType('status');
                      setShowBookingModal(true);
                    }}
                    className="text-white transition-colors rounded-lg px-4 py-2 xl:px-6 xl:py-3 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    style={{ 
                      backgroundColor: '#f87171'
                    }}
                    onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = '#f87171'}
                    onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = '#f87171'}
                  >
                    <span className="text-sm xl:text-base font-medium">Confirm Status</span>
                  </button>
                )}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8" style={{ paddingBottom: (!user || (user.role !== 'admin' && user.role !== 'staff')) ? '5rem' : '2rem' }}>
          <div className="mt-6 space-y-6 xl:space-y-8">
            {/* Property Information */}
            <div className="space-y-2 xl:space-y-3">
              <div className="text-lg xl:text-xl text-gray-900">
                <span className="font-bold">Price:</span> <span className="ml-1">{formatPrice(property.price)}/month</span>
              </div>
              <div className="text-lg xl:text-xl text-gray-900">
                <span className="font-bold">Plan:</span> <span className="ml-1">{property.plan} Months</span>
              </div>
              <div className="text-sm xl:text-base text-black bg-yellow-200 px-3 xl:px-4 py-1 xl:py-1.5 rounded w-fit flex items-center justify-center border border-black">
                <MapPin size={12} className="xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                <span>{property.location}</span>
              </div>
              <div className="text-sm xl:text-base text-gray-600 flex items-center">
                <Clock size={12} className="xl:w-4 xl:h-4 mr-1 flex-shrink-0" />
                <span>Updated: {getRelativeTime(property.updatedAt)}</span>
              </div>
              
              {/* Uploaded By - Admin/Staff Only */}
              {(user?.role === 'admin' || (user?.role === 'staff' && user?.isApproved)) && (
                <>
                  {('ownerName' in property && property.ownerName) || ('ownerEmail' in property && property.ownerEmail) ? (
                    <>
                      {'ownerName' in property && property.ownerName && (
                        <div className="text-lg xl:text-xl text-gray-900">
                          <span className="font-bold">Uploaded by:</span> <span className="ml-1">{property.ownerName}</span>
                        </div>
                      )}
                      {'ownerEmail' in property && property.ownerEmail && (
                        <div className="text-lg xl:text-xl text-gray-900">
                          <span className="font-bold">Email:</span> <span className="ml-1">{property.ownerEmail}</span>
                    </div>
                      )}
                    </>
                  ) : null}
                </>
              )}
                    </div>

            {/* Contact Information - Only show if available */}
            {(property.contactName || property.contactPhone || property.contactEmail) && (
              <div className="mt-6 xl:mt-8">
                <h3 className="text-lg xl:text-xl font-semibold text-gray-900 mb-3 xl:mb-4">Contact Information</h3>
                <div className="space-y-3 xl:space-y-4">
                  {property.contactName && (
                    <div className="text-gray-700 xl:text-lg">
                      <strong>Contact:</strong> <span className="ml-1">{property.contactName}</span>
                    </div>
                  )}
                  {property.contactPhone && (
                    <div className="text-gray-700 xl:text-lg">
                      <strong>Phone:</strong> <span className="ml-1">{property.contactPhone}</span>
                    </div>
                  )}
                  {property.contactEmail && (
                    <div className="text-gray-700 xl:text-lg">
                      <strong>Email:</strong> <span className="ml-1">{property.contactEmail}</span>
                    </div>
                  )}
                </div>
                  </div>
            )}
                </div>
              </div>
            </div>

      {/* Fixed Confirm & Book / Confirm Status Button - Mobile Only - Visible for all users (logged in or not) except admin/staff */}
      {(!user || (user.role !== 'admin' && user.role !== 'staff')) && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-center">
            {property.status === 'available' ? (
              <button
                onClick={() => {
                  setBookingModalType('book');
                  setShowBookingModal(true);
                }}
                className="w-full max-w-md text-white transition-colors rounded-lg px-4 py-3 xl:px-6 xl:py-3.5 cursor-pointer flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.9)'
                }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 1)'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(34, 197, 94, 0.9)'}
              >
                <span className="text-base xl:text-lg font-medium">Confirm & Book</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setBookingModalType('status');
                  setShowBookingModal(true);
                }}
                className="w-full max-w-md text-white transition-colors rounded-lg px-4 py-3 xl:px-6 xl:py-3.5 cursor-pointer flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: '#f87171'
                }}
                onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = '#f87171'}
                onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = '#f87171'}
              >
                <span className="text-base xl:text-lg font-medium">Confirm Status</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox */}
      {isLightboxOpen && property.images && property.images.length > 0 && (
        <ImageLightbox
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => {
            setIsLightboxOpen(false);
            setDisplayedImageIndex(currentImageIndex);
          }}
          onImageChange={setCurrentImageIndex}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            touchAction: 'none',
            minHeight: '100vh',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-white rounded-xl px-4 pt-3 pb-4 sm:px-6 sm:pt-2 sm:pb-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center items-center mb-4">
              <h3 className="text-xl font-semibold text-black">
                {bookingModalType === 'book' ? 'Book This Property' : 'Confirm Status of This Property'}
              </h3>
          </div>

            <div className="space-y-3 sm:space-y-4 mb-3 sm:mb-4">
              <button
                onClick={() => {
                  if (property) {
                    // Construct property URL
                    const propertyUrl = typeof window !== 'undefined' 
                      ? `${window.location.origin}/property/${property.id}`
                      : `/property/${property.id}`;
                    
                    // Format WhatsApp message with line breaks
                    const message = `Hi..!\n\nI am interested in this property for rent. I want to confirm its availability and finalize the booking. Thank you.\n\n${property.title}\n${property.location}\n\n${propertyUrl}`;
                    const whatsappMessage = encodeURIComponent(message);
                    window.open(`https://wa.me/255755123500?text=${whatsappMessage}`, '_blank');
                  } else {
                    window.open('https://wa.me/255755123500', '_blank');
                  }
                  setShowBookingModal(false);
                }}
                className="w-full flex items-center space-x-3 p-2 sm:p-3 bg-green-300 hover:bg-green-400 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">WhatsApp</p>
                  <p className="text-sm text-gray-600">Message us via WhatsApp</p>
                </div>
              </button>

              <button
                onClick={() => {
                  window.open('tel:+255755123500', '_self');
                  setShowBookingModal(false);
                }}
                className="w-full flex items-center space-x-3 p-2 sm:p-3 bg-blue-300 hover:bg-blue-400 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Phone</p>
                  <p className="text-sm text-gray-600">Call us directly</p>
                </div>
              </button>

              <button
                onClick={() => {
                  if (property) {
                    // Construct property URL
                    const propertyUrl = typeof window !== 'undefined' 
                      ? `${window.location.origin}/property/${property.id}`
                      : `/property/${property.id}`;
                    
                    // Format SMS message with line breaks (same format as WhatsApp)
                    const message = `Hi..!\n\nI am interested in this property for rent. I want to confirm its availability and finalize the booking. Thank you.\n\n${property.title}\n${property.location}\n\n${propertyUrl}`;
                    const smsMessage = encodeURIComponent(message);
                    window.open(`sms:+255755123500?body=${smsMessage}`, '_self');
                  } else {
                    window.open('sms:+255755123500', '_self');
                  }
                  setShowBookingModal(false);
                }}
                className="w-full flex items-center space-x-3 p-2 sm:p-3 bg-blue-300 hover:bg-blue-400 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Message</p>
                  <p className="text-sm text-gray-600">Send us direct message</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowBookingModal(false)}
              className="w-full px-4 py-2 rounded-lg font-medium transition-colors bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            images: property.images || [],
            description: property.description,
            propertyType: 'propertyType' in property ? property.propertyType : undefined
          }
        }}
      />
    </Layout>
  );
}
