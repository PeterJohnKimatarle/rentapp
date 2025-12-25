'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface InstallRentappButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function InstallRentappButton({ variant = 'default', onItemClick }: InstallRentappButtonProps) {
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
        <Download size={20} className="flex-shrink-0" />
        <span className="text-base font-medium">Install Rentapp</span>
      </button>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Install Rentapp</h3>
            <p className="text-gray-600 mb-4 text-center">Installation instructions go here</p>
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}