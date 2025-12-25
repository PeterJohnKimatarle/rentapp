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

  const handleClick = () => {
    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
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
          <div
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
            style={{
              touchAction: 'none',
              minHeight: '100vh',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            onClick={closeModal}
          >
            <div
              className="rounded-xl p-6 w-full max-w-sm shadow-2xl overflow-hidden bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">testament</h3>
              <p className="text-gray-600 mb-6 text-center">This is the testament modal content</p>
              <button
                onClick={closeModal}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
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
