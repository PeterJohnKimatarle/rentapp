'use client';

import { useState } from 'react';
import { X, Share2, Copy, MessageCircle, Facebook, Mail, Smartphone, Link, Send } from 'lucide-react';
import { ShareManager, ShareOptions } from '@/utils/shareUtils';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  shareOptions: ShareOptions;
}

export default function SharePopup({ isOpen, onClose, shareOptions }: SharePopupProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleShare = async (shareMethod: string, shareFunction: () => void | Promise<boolean>) => {
    setIsLoading(shareMethod);
    
    try {
      if (shareMethod === 'copy') {
        const success = await ShareManager.copyToClipboard(shareOptions);
        if (success) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } else if (shareMethod === 'native') {
        const success = await ShareManager.shareNative(shareOptions);
        if (success) {
          onClose();
        }
      } else {
        shareFunction();
        onClose();
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const shareButtons = [
    {
      id: 'native',
      label: 'Share',
      icon: Share2,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => ShareManager.shareNative(shareOptions),
      show: false // Hide native share on desktop
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      color: 'bg-gray-400 hover:bg-gray-500',
      action: () => ShareManager.shareEmail(shareOptions),
      show: true
    },
    {
      id: 'copy',
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Link : Copy,
      color: copied ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600',
      action: () => ShareManager.copyToClipboard(shareOptions),
      show: true
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: Send,
      color: 'bg-cyan-500 hover:bg-cyan-600',
      action: () => ShareManager.shareTelegram(shareOptions),
      show: true
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => ShareManager.shareWhatsApp(shareOptions),
      show: true
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => ShareManager.shareFacebook(shareOptions),
      show: true
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: Smartphone,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => ShareManager.shareSMS(shareOptions),
      show: true
    }
  ];

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
    >
      <div 
        className="rounded-xl max-w-md w-full p-6 shadow-lg overflow-hidden"
        style={{ backgroundColor: '#0071c2' }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white px-4" style={{ borderBottom: '2px solid #eab308' }}>
            Share Property
          </h3>
          <button
            onClick={onClose}
            className="text-white transition-colors rounded-lg p-2 cursor-pointer"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
            onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Property Preview */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
          <div className="flex items-center space-x-3">
            {/* Property Image */}
            <div className="flex-shrink-0">
              <img
                src={shareOptions.property.images[0]}
                alt={`${shareOptions.property.bedrooms} bedroom apartment in ${shareOptions.property.location}`}
                className="w-24 h-24 rounded-lg object-cover border-2 border-yellow-500"
              />
            </div>
            
            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm mb-1">
                {shareOptions.property.bedrooms} Bedroom Apartment
              </div>
              <div className="text-white/90 text-xs mb-2">
                {shareOptions.property.location}
              </div>
              <div className="text-yellow-400 font-semibold text-sm">
                {new Intl.NumberFormat('en-TZ', {
                  style: 'currency',
                  currency: 'TZS',
                  minimumFractionDigits: 0,
                }).format(shareOptions.property.price)}/month
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-2 gap-3">
          {shareButtons.filter(button => button.show).map((button) => {
            const IconComponent = button.icon;
            const isButtonLoading = isLoading === button.id;
            
            return (
              <button
                key={button.id}
                onClick={() => handleShare(button.id, button.action)}
                disabled={isButtonLoading}
                className={`${button.color} text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isButtonLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <IconComponent size={18} />
                )}
                <span className="text-sm">{button.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="text-white/80 text-xs text-center mb-4">
            Share this amazing property with friends and family
          </div>
          <button
            onClick={onClose}
            className="w-full text-white transition-colors rounded-lg p-2 cursor-pointer font-medium"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onMouseEnter={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(239, 68, 68, 1)'}
            onMouseLeave={(e: React.MouseEvent) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
