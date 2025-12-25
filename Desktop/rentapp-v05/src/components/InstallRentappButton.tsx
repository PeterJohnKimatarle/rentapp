'use client';

import { Download } from 'lucide-react';

interface InstallRentappButtonProps {
  variant?: 'default' | 'popup';
  onItemClick?: () => void;
}

export default function InstallRentappButton({ variant = 'default', onItemClick }: InstallRentappButtonProps) {
  return (
    <div
      className={`flex items-center space-x-3 ${
        variant === 'popup'
          ? 'text-gray-800 px-4 py-2 rounded-lg w-full justify-start h-10 border border-white border-opacity-30 bg-blue-100'
          : 'text-gray-700 rounded-lg px-3 py-2 w-full'
      }`}
    >
      <Download size={20} className="flex-shrink-0" />
      <span className="text-base font-medium">Install Rentapp</span>
    </div>
  );
}