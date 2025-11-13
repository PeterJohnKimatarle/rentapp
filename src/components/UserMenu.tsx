'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LogOut, MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorPosition: { top: number; right: number } | null;
}

export default function UserMenu({ isOpen, onClose, anchorPosition }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const positionStyle = useMemo(() => {
    if (!anchorPosition) {
      return { visibility: 'hidden' } as React.CSSProperties;
    }
    return {
      top: `${anchorPosition.top}px`,
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70]"
      style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
      onClick={handleBackdropClick}
    >
      <div
        className="absolute bg-gray-50 rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-500 shadow-blue-100"
        style={positionStyle}
      >
        <div className="relative p-5 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white">
          <p className="text-sm tracking-wide text-blue-100 font-semibold mb-2">Logged in as</p>
          <h3 className="text-2xl font-bold leading-tight">{user?.name || 'Guest User'}</h3>
          <p className="text-blue-100 text-sm">{user?.email || 'No email provided'}</p>
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
                    logout();
                    setShowConfirmLogout(false);
                    onClose();
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
