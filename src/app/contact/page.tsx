"use client";

import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Instagram, Linkedin, X, MessageCircle, PhoneCall } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
  };

  const handlePhoneCardClick = () => {
    setIsContactPopupOpen(true);
  };

  const handleWhatsAppMessage = () => {
    window.open('https://wa.me/255755123500', '_blank');
    setIsContactPopupOpen(false);
  };

  const handleNormalCall = () => {
    window.open('tel:+255755123500', '_self');
    setIsContactPopupOpen(false);
  };

  const handleNormalMessage = () => {
    window.open('sms:+255755123500', '_self');
    setIsContactPopupOpen(false);
  };

  const handleEmailClick = () => {
    window.open('mailto:rentappglobal@gmail.com', '_self');
  };

  return (
    <Layout>
        <div className="bg-gray-50 pt-2 pb-2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-600 mb-1">
                Contact Us
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We&apos;re here to help you with any questions about our services.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Contact Information */}
              <div className="space-y-3 max-w-4xl w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-600 mb-1 text-center">Get in Touch</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div 
                    onClick={handleEmailClick}
                    className="bg-white px-6 py-3 rounded-xl shadow-lg border border-blue-500 border-2 shadow-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-black">Email</h3>
                      <p className="text-gray-600">rentappglobal@gmail.com</p>
                    </div>
                  </div>

                    <div 
                      onClick={handlePhoneCardClick}
                      className="bg-white px-6 py-3 rounded-xl shadow-lg border border-blue-500 border-2 shadow-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-black">Phone/WhatsApp</h3>
                        <p className="text-gray-600">0755-123-500</p>
                      </div>
                    </div>

                  <div className="bg-white px-6 py-3 rounded-xl shadow-lg border border-blue-500 border-2 shadow-blue-100">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-black">Business Hours</h3>
                      <p className="text-gray-600">24/7 Available</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            </div>

          </div>
        </div>

        {/* Contact Options Popup */}
        {isContactPopupOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Choose Contact Method</h3>
                <button
                  onClick={() => setIsContactPopupOpen(false)}
                  className="text-white transition-colors rounded-lg p-2 cursor-pointer"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                  onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
                  onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppMessage}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">WhatsApp</p>
                    <p className="text-sm text-gray-600">Message or call via WhatsApp</p>
                  </div>
                </button>

                <button
                  onClick={handleNormalCall}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Normal Call</p>
                    <p className="text-sm text-gray-600">Regular phone call</p>
                  </div>
                </button>

                <button
                  onClick={handleNormalMessage}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Normal Message</p>
                    <p className="text-sm text-gray-600">SMS text message</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
    </Layout>
  );
}
