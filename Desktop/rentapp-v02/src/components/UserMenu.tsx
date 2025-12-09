'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePreventScroll } from '@/hooks/usePreventScroll';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorPosition: { top: number; right: number } | null;
}

export default function UserMenu({ isOpen, onClose, anchorPosition }: UserMenuProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const isApprovedStaff = isStaff && user?.isApproved === true;
  const isAdmin = user?.role === 'admin';

  // Prevent body scroll when menu is open
  usePreventScroll(isOpen);

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

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Only close on desktop when clicking backdrop
      if (window.innerWidth >= 1280 && event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const roleBanner = getUserRoleBanner();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 xl:bg-transparent"
      style={{ minHeight: '100vh', height: '100%' }}
      onClick={handleBackdropClick}
    >
      <div
        className="fixed bg-blue-200 rounded-2xl shadow-2xl overflow-hidden outline-none"
        style={positionStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-5 bg-blue-500 text-white">
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
                className="w-full px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center"
                onClick={() => {
                  onClose();
                  router.push('/profile');
                }}
              >
                View profile
              </button>
              <button
                className="w-full px-4 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center"
                onClick={() => {
                  onClose();
                  router.push('/contact');
                }}
              >
                Feedback
              </button>
            <button
                className="xl:hidden w-full px-4 py-3 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center justify-center"
              onClick={onClose}
            >
                Close
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
