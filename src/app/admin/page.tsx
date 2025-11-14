'use client';

import Layout from '@/components/Layout';
import LoginPopup from '@/components/LoginPopup';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Users, ClipboardList, Settings, UserCheck, Check, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAuthenticated, user, getAllStaff, approveStaff, disapproveStaff, deleteUser, isLoading } = useAuth();
  const router = useRouter();
  const wasAuthenticatedRef = useRef(isAuthenticated);
  const isAdmin = user?.role === 'admin';
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDisapproveFor, setShowDisapproveFor] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  useEffect(() => {
    if (isAdmin) {
      loadStaff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const loadStaff = () => {
    const staff = getAllStaff();
    setStaffMembers(staff);
  };

  const handleApprove = async (staffId: string) => {
    setLoading(true);
    setMessage(null);
    const result = await approveStaff(staffId);
    if (result.success) {
      setMessage({ type: 'success', text: 'Staff member approved successfully!' });
      loadStaff();
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to approve staff member.' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDisapprove = async (staffId: string) => {
    setLoading(true);
    setMessage(null);
    const result = await disapproveStaff(staffId);
    if (result.success) {
      setMessage({ type: 'success', text: 'Staff member disapproved successfully!' });
      setShowDisapproveFor(null); // Hide disapprove button after disapproval
      loadStaff();
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to disapprove staff member.' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setMessage(null);
    const result = await deleteUser(staffId);
    if (result.success) {
      setMessage({ type: 'success', text: 'Staff member deleted successfully!' });
      loadStaff();
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to delete staff member.' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

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

    // Wait for auth to finish loading before showing content
    if (isLoading) {
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin access required</h2>
          <p className="text-gray-600 mb-6">
            Log in with your Rentapp admin credentials to access the admin portal.
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

    if (!isAdmin) {
      return (
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
          <ShieldCheck size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            This area is restricted to administrators only. You do not have permission to access this page.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <section className="bg-white border border-purple-200 rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-purple-500 font-semibold">Admin Portal</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">Rentapp Admin Dashboard</h2>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Control center for administrators—manage staff approvals, oversee platform operations, and monitor system activity.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm text-purple-900">
              <p className="font-semibold">Signed in as</p>
              <p>{user?.firstName || user?.name?.split(' ')[0] || user?.email}</p>
              <p className="uppercase tracking-wide text-xs mt-1">Role: Admin</p>
            </div>
          </div>
        </section>

        {/* Staff Management Section */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck size={24} className="text-purple-500" />
            <h3 className="text-xl font-semibold text-gray-900">Staff Management</h3>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {staffMembers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No staff members found.</p>
          ) : (
            <div className="space-y-4">
              {staffMembers.map((staff) => (
                <div
                  key={staff.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {staff.firstName || staff.name || 'Unknown'}
                        </h4>
                        {staff.isApproved ? (
                          <button
                            onClick={() => setShowDisapproveFor(showDisapproveFor === staff.id ? null : staff.id)}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full hover:bg-green-200 cursor-pointer transition-colors"
                          >
                            Approved
                          </button>
                        ) : (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{staff.email}</p>
                      {staff.phone && (
                        <p className="text-sm text-gray-600">{staff.phone}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!staff.isApproved ? (
                        <button
                          onClick={() => handleApprove(staff.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                      ) : showDisapproveFor === staff.id && (
                        <>
                          <button
                            onClick={() => handleDelete(staff.id, staff.firstName || staff.name || 'this staff member')}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                          <button
                            onClick={() => handleDisapprove(staff.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Disapprove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} className="text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-sm text-gray-600">
              View and manage all user accounts across the platform.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={24} className="text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Platform Settings</h3>
            </div>
            <p className="text-sm text-gray-600">
              Configure system settings and manage platform-wide options.
            </p>
          </div>
        </section>

        <section className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Admin Tools</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-1 mb-3">System Administration</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            As features are developed, this portal will provide tools for staff management, user oversight, and platform configuration.
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

