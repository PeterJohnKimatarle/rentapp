'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, Mail, Calendar } from 'lucide-react';
import { properties } from '@/data/properties';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const propertyId = params.id;
    const foundProperty = properties.find(p => p.id === propertyId);
    setProperty(foundProperty);
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };


  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-2">Property Not Found</div>
          <div className="text-gray-600 mb-4">The property you're looking for doesn't exist.</div>
          <button
            onClick={() => router.push('/')}
            className="bg-booking-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Property Details</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Property Features</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Bed size={20} className="text-booking-blue" />
                      <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bath size={20} className="text-booking-blue" />
                      <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Square size={20} className="text-booking-blue" />
                      <span className="text-gray-700">{property.area} m²</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin size={20} className="text-booking-blue" />
                      <span className="text-gray-700">{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar size={20} className="text-booking-blue" />
                      <span className="text-gray-700">Available Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Info Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                <div className="text-3xl font-bold text-booking-blue mb-4">
                  {formatPrice(property.price)}
                  <span className="text-sm font-normal text-gray-500 ml-1">per month</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPin size={18} className="text-gray-500" />
                    <span className="text-gray-700">{property.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-booking-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    <Phone size={18} className="inline mr-2" />
                    Contact Agent
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    <Calendar size={18} className="inline mr-2" />
                    Schedule Viewing
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <Mail size={18} className="inline mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
