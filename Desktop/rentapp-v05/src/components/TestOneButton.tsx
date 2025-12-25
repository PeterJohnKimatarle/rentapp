'use client';

import { TestTube } from 'lucide-react';

interface TestOneButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
  onTestamentClick?: () => void;
}

export default function TestOneButton({ variant = 'default', onItemClick, onTestamentClick }: TestOneButtonProps) {
  // Detect touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent backdrop click handler from receiving this event
    console.log('Test One button clicked - opening modal');

    // Open testament modal
    if (onTestamentClick) {
      onTestamentClick();
    }

    // Handle menu modal closing
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

  return (
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
  );
}
