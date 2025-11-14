'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageCircle, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorPosition: { top: number; right: number } | null;
}

export default function UserMenu({ isOpen, onClose, anchorPosition }: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'staff';
  const isApprovedStaff = isStaff && user?.isApproved === true;
  const isAdmin = user?.role === 'admin';
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const positionStyle = useMemo(() => {
    if (!anchorPosition) {
      return { visibility: 'hidden' } as React.CSSProperties;
    }
    return {
      top: `${Math.max(anchorPosition.top - 2, 16)}px`,
      right: `${Math.max(anchorPosition.right - 24, 16)}px`,
      width: 'min(280px, calc(100vw - 32px))',
      minWidth: '220px',
      visibility: 'visible',
    } as React.CSSProperties;
  }, [anchorPosition]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const displayFirstName = user?.firstName || user?.name?.split(' ')[0] || 'Guest User';

  // Get user role display info
  const getUserRoleBanner = () => {
    if (isAdmin) {
      return {
        text: 'ADMIN',
        bgColor: 'bg-red-500',
        textColor: 'text-white'
      };
    }
    if (isApprovedStaff) {
      return {
        text: 'STAFF',
        bgColor: 'bg-purple-500',
        textColor: 'text-white'
      };
    }
    if (isStaff && !isApprovedStaff) {
      return {
        text: 'STAFF (PENDING)',
        bgColor: 'bg-orange-500',
        textColor: 'text-white'
      };
    }
    return {
      text: 'MEMBER',
      bgColor: 'bg-blue-500',
      textColor: 'text-white'
    };
  };

  const roleBanner = getUserRoleBanner();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70]"
      style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute bg-blue-200 rounded-2xl shadow-2xl overflow-hidden outline-none"
        style={positionStyle}
      >
        <div className="relative p-5 bg-gray-500 text-white">
          <div className="flex items-center gap-3 flex-wrap mb-0.5">
            <p className="text-sm tracking-wide text-gray-100 font-semibold">Logged in as</p>
            <div className={`inline-block ${roleBanner.bgColor} ${roleBanner.textColor} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}>
              {roleBanner.text}
            </div>
          </div>
          <h3 className="text-2xl font-bold leading-tight">{displayFirstName}</h3>
          <p className="text-gray-100 text-sm mt-0.5">{user?.email || 'No email provided'}</p>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <button
                className="w-full px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  window.location.href = '/profile';
                }}
              >
                <User size={18} />
                View profile
              </button>
              {isApprovedStaff && (
                <button
                  className="w-full px-4 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    onClose();
                    window.location.href = '/staff';
                  }}
                >
                  <ShieldCheck size={18} />
                  Staff Portal
                </button>
              )}
              {isAdmin && (
                <button
                  className="w-full px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    onClose();
                    window.location.href = '/admin';
                  }}
                >
                  <ShieldCheck size={18} />
                  Admin Portal
                </button>
              )}
              <button
                className="w-full pl-4 pr-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  window.location.href = '/contact';
                }}
              >
                <MessageCircle size={18} />
                Feedback
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 rounded-xl bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-xl bg-red-400 text-white hover:bg-red-500 transition-colors"
                onClick={() => setShowConfirmLogout(true)}
              >
                Log out
              </button>
            </div>
          </div>
        </div>

        {showConfirmLogout && (
          <div
            className="fixed inset-0 bg-black/30 z-[80] flex items-center justify-center"
            onClick={() => setShowConfirmLogout(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-80 p-6 border border-red-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Log out</h4>
              <p className="text-sm text-gray-600 mb-4">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                  onClick={() => {
                    const wasAdmin = isAdmin;
                    logout();
                    setShowConfirmLogout(false);
                    onClose();
                    // Redirect admin users to homepage after logout
                    if (wasAdmin) {
                      router.push('/');
                    }
                  }}
                >
                  Yes
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
