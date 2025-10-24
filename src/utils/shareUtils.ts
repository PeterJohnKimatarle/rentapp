export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export interface ShareOptions {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    description?: string;
  };
}

export class ShareManager {
  private static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  }

  private static getShareUrl(propertyId: string): string {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/property/${propertyId}`;
    }
    return `https://rentapp.com/property/${propertyId}`;
  }

  private static getShareData(options: ShareOptions): ShareData {
    const { property } = options;
    const url = this.getShareUrl(property.id);
    const price = this.formatPrice(property.price);
    
    return {
      title: `${property.bedrooms} Bedroom Apartment in ${property.location}`,
      text: `Check out this amazing ${property.bedrooms} bedroom apartment in ${property.location} for ${price}/month! ${property.area}m² with ${property.bathrooms} bathrooms.`,
      url: url,
      image: property.images[0]
    };
  }

  // Web Share API (Native sharing)
  static async shareNative(options: ShareOptions): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      const shareData = this.getShareData(options);
      await navigator.share(shareData);
      return true;
    } catch (error) {
      console.log('Native sharing cancelled or failed:', error);
      return false;
    }
  }

  // Copy to clipboard
  static async copyToClipboard(options: ShareOptions): Promise<boolean> {
    try {
      const shareData = this.getShareData(options);
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }

  // WhatsApp sharing
  static shareWhatsApp(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const message = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  // Facebook sharing
  static shareFacebook(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }

  // Twitter sharing
  static shareTwitter(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const text = encodeURIComponent(`${shareData.title} - ${shareData.url}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }

  // Email sharing
  static shareEmail(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const subject = encodeURIComponent(shareData.title);
    const body = encodeURIComponent(`${shareData.text}\n\nView property: ${shareData.url}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  }

  // SMS sharing
  static shareSMS(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const message = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
    const smsUrl = `sms:?body=${message}`;
    window.location.href = smsUrl;
  }

  // Telegram sharing
  static shareTelegram(options: ShareOptions): void {
    const shareData = this.getShareData(options);
    const message = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${message}`;
    window.open(telegramUrl, '_blank', 'width=600,height=400');
  }

  // Check if native sharing is supported
  static isNativeShareSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  // Check if clipboard API is supported
  static isClipboardSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.clipboard;
  }
}
