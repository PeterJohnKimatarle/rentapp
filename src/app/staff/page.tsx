'use client';

import Layout from '@/components/Layout';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Archive, Clock, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProperties } from '@/utils/propertyUtils';

type ViewType = 'closed' | 'followup';

export default function StaffPortalPage() {
  const { isAuthenticated, user, isLoading, isImpersonating } = useAuth();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(isAuthenticated);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('closed');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [closedProperties, setClosedProperties] = useState(0);
  const [followUpProperties, setFollowUpProperties] = useState(0);

  const isStaff = user?.role === 'staff';
  const isApproved = user?.isApproved === true;

  useEffect(() => {
    // Load data when approved staff
    if (isApproved && typeof window !== 'undefined') {
      // Closed properties: For now, no properties are marked as closed
      // This will be implemented when staff can mark properties as closed/rented
      setClosedProperties(0);
      
      // Follow up properties are those with status 'available'
      const properties = getAllProperties();
      const followUp = properties.filter(p => p.status === 'available');
      setFollowUpProperties(followUp.length);
    } else {
      // Reset counts when not approved
      setClosedProperties(0);
      setFollowUpProperties(0);
    }
  }, [isApproved]);

  useEffect(() => {
    // Detect logout transition
    if (wasAuthenticatedRef.current && !isAuthenticated && !isLoading) {
      setIsLoggingOut(true);
      // Redirect to homepage after brief delay
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
    wasAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, isLoading, router]);

  const renderContent = () => {
    // Wait silently during loading - don't show anything
    if (isLoggingOut || (isLoading && wasAuthenticatedRef.current)) {
      return null;
    }

    // Wait silently for auth to finish loading - don't show anything
    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      return (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-8 text-center">
          <ShieldCheck size={48} className="mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Staff access required</h2>
          <p className="text-gray-600 mb-6">
            Log in with your Rentapp staff credentials to open the internal portal.
          </p>
          <button
            onClick={() => setIsLoginPopupOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Open login popup
          </button>
        </div>
      );
    }

    if (!isStaff) {
      return (
        <div className="bg-white rounded-xl border border-yellow-200 shadow-sm p-8 text-center">
          <ShieldCheck size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Limited permissions</h2>
          <p className="text-gray-600">
            You are signed in as a public user. Staff-only tools will appear here once your
            account has the appropriate access level.
          </p>
        </div>
      );
    }

    // Check if staff is approved
    if (isStaff && !isApproved) {
      return (
        <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-8 text-center">
          <ShieldCheck size={48} className="mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your staff account registration is pending admin approval. You will be able to access
            staff features and the portal once an administrator approves your account.
          </p>
          <p className="text-sm text-gray-500">
            Please wait for admin approval or contact support if you need urgent access.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 relative">
        {/* Closed Properties View */}
        {currentView === 'closed' && (
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Archive size={24} className="text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-1">
                Closed Properties
                {isImpersonating && (
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-0.5"></span>
                )}
              </h3>
              <p className="text-lg font-medium text-gray-900">[{closedProperties}]</p>
            </div>
            {closedProperties === 0 ? (
              <p className="text-gray-600 text-center py-8">No closed properties found.</p>
            ) : (
              <div className="space-y-4">
                {/* Properties list will go here in the future */}
                <p className="text-gray-600 text-center py-4">Property details will be displayed here.</p>
              </div>
            )}
          </section>
        )}

        {/* Follow Up Properties View */}
        {currentView === 'followup' && (
          <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Clock size={24} className="text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-1">
                Follow Up Properties
                {isImpersonating && (
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-0.5"></span>
                )}
              </h3>
              <p className="text-lg font-medium text-gray-900">[{followUpProperties}]</p>
            </div>
            {followUpProperties === 0 ? (
              <p className="text-gray-600 text-center py-8">No follow up properties found.</p>
            ) : (
              <div className="space-y-4">
                {/* Properties list will go here in the future */}
                <p className="text-gray-600 text-center py-4">Property details will be displayed here.</p>
              </div>
            )}
          </section>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-[58%] -translate-y-1/2 right-6 w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all duration-200 flex items-center justify-center z-40 hover:scale-110"
          title="Staff Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Popup */}
        {isMenuOpen && (
          <>
            <div
              className="fixed top-[58%] -translate-y-[55px] right-24 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    setCurrentView('closed');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 text-left ${
                    currentView === 'closed'
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Archive size={20} />
                  Closed Properties
                </button>
                <button
                  onClick={() => {
                    setCurrentView('followup');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 text-left ${
                    currentView === 'followup'
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Clock size={20} />
                  Follow Up Properties
                </button>
              </div>
            </div>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{renderContent()}</div>
      </div>

      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
    </Layout>
  );
}
