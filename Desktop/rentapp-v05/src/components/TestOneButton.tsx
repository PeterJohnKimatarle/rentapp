'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TestTube } from 'lucide-react';

interface TestOneButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function TestOneButton({ variant = 'default', onItemClick }: TestOneButtonProps) {
  const [showModal, setShowModal] = useState(false);

  // Detect touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent backdrop click handler from receiving this event
    console.log('Test One button clicked - opening modal');
    setShowModal(true);

    if (variant === 'popup' && onItemClick) {
      if (isTouchDevice) {
        // On mobile: delay closing menu modal by 150ms to prevent flashing
        setTimeout(onItemClick, 150);
      } else {
        // On desktop: close menu modal immediately (existing behavior)
        onItemClick();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        onTouchStart={(e) => e.stopPropagation()} // Prevent touch events from bubbling to backdrop
        className={`flex items-center space-x-3 ${
          variant === 'popup'
            ? 'text-gray-800 hover:text-black px-4 py-2 rounded-lg hover:bg-yellow-500 w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100 cursor-pointer'
            : 'text-gray-700 hover:text-black hover:bg-yellow-500 rounded-lg px-3 py-2 w-full cursor-pointer'
        }`}
      >
        <TestTube size={20} className="flex-shrink-0" />
        <span className="text-base font-medium">test-one</span>
      </button>

      {/* Testament Modal */}
      {showModal && typeof document !== 'undefined' &&
        createPortal(
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              maxWidth: '24rem',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                testament
              </h3>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                This is the testament modal content
              </p>
              <button
                onClick={() => {
                  console.log('Close button clicked');
                  closeModal();
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
