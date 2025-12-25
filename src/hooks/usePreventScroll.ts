import { useEffect, useLayoutEffect } from 'react';

// Global scroll lock manager
class GlobalScrollLock {
  private static instance: GlobalScrollLock;
  private modalCount = 0;
  private scrollY = 0;
  private isLocked = false;

  static getInstance(): GlobalScrollLock {
    if (!GlobalScrollLock.instance) {
      GlobalScrollLock.instance = new GlobalScrollLock();
    }
    return GlobalScrollLock.instance;
  }

  lock(): void {
    this.modalCount++;
    if (this.modalCount === 1 && !this.isLocked) {
      this.isLocked = true;
      this.scrollY = typeof window !== 'undefined' ?
        (window.scrollY || window.pageYOffset || 0) : 0;

      const body = document.body;
      const html = document.documentElement;

      // Lock scroll
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${this.scrollY}px`;
      body.style.width = '100%';
      body.style.left = '0';
      body.style.right = '0';
    }
  }

  unlock(): void {
    this.modalCount = Math.max(0, this.modalCount - 1);
    if (this.modalCount === 0 && this.isLocked) {
      this.isLocked = false;

      const body = document.body;
      const html = document.documentElement;

      // Unlock scroll
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.left = '';
      body.style.right = '';

      // Restore scroll position
      window.scrollTo(0, this.scrollY);
    }
  }

  isScrollLocked(): boolean {
    return this.isLocked;
  }
}

const globalScrollLock = GlobalScrollLock.getInstance();

/**
 * Hook to prevent page scrolling when a popup/modal is open
 * Uses global scroll lock to ensure only one lock regardless of multiple callers
 *
 * Usage:
 * ```tsx
 * const [isPopupOpen, setIsPopupOpen] = useState(false);
 * usePreventScroll(isPopupOpen);
 *
 * // Also add these styles to your popup overlay:
 * <div
 *   className="fixed inset-0 ..."
 *   style={{ touchAction: 'none', minHeight: '100vh', height: '100%' }}
 * >
 * ```
 *
 * @param isOpen - Whether the popup/modal is open
 */
export function usePreventScroll(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      globalScrollLock.lock();
    } else {
      globalScrollLock.unlock();
    }

    // Cleanup on unmount
    return () => {
      if (isOpen) {
        globalScrollLock.unlock();
      }
    };
  }, [isOpen]);
}

