'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { MessageCircle, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
      event.preventDefault();
      event.stopPropagation();
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
      style={{ touchAction: 'none', minHeight: '100vh', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="absolute bg-blue-200 rounded-2xl shadow-2xl overflow-hidden outline-none"
        style={positionStyle}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
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
                className="w-full px-4 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  router.push('/profile');
                }}
              >
                <User size={18} />
                View profile
              </button>
              <button
                className="w-full pl-4 pr-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  router.push('/contact');
                }}
              >
                <MessageCircle size={18} />
                Feedback
              </button>
            </div>
            <button
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
              onClick={onClose}
            >
              <X size={18} />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
