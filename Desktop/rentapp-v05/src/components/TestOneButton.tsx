'use client';

import { TestTube } from 'lucide-react';

interface TestOneButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function TestOneButton({ variant = 'default', onItemClick }: TestOneButtonProps) {
  const handleClick = () => {
    if (variant === 'popup' && onItemClick) {
      onItemClick();
    }
    console.log('Test One button clicked');
  };

  return (
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
  );
}
