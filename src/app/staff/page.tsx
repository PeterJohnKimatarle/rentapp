'use client';

import Layout from '@/components/Layout';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, ClipboardList, Users, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffPortalPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(isAuthenticated);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isStaff = user?.role === 'staff';
  const isApproved = user?.isApproved === true;

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
    // Show loading during logout transition
    if (isLoggingOut || (isLoading && wasAuthenticatedRef.current)) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="animate-pulse">
            <ShieldCheck size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
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
      <div className="space-y-8">
        <section className="bg-white border border-blue-200 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold">Welcome</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Rentapp Staff Portal</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                This area will evolve into the control center for internal teams—approving property
                listings, supporting customers, and monitoring platform activity.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-900">
              <p className="font-semibold">Signed in as</p>
              <p>{user?.firstName || user?.name?.split(' ')[0] || user?.email}</p>
              <p className="uppercase tracking-wide text-xs mt-1">Role: Staff</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList size={24} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Pending approvals</h3>
            </div>
            <p className="text-sm text-gray-600">
              Future space for reviewing new property submissions before they go live.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Customer snapshots</h3>
            </div>
            <p className="text-sm text-gray-600">
              Placeholder for user overviews, account status, and quick escalation tools.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={24} className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Platform health</h3>
            </div>
            <p className="text-sm text-gray-600">
              Slot for analytics, alerts, and operational runbooks once monitoring is wired up.
            </p>
          </div>
        </section>

        <section className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Roadmap</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-1 mb-3">Next steps for this portal</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            As the backend lands, we can wire these tiles into real data, add role management, and
            create task-specific pages for operations, compliance, and support teams.
          </p>
        </section>
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

