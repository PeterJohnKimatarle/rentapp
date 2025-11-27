import { useEffect, useLayoutEffect } from 'react';

/**
 * Hook to prevent page scrolling when a popup/modal is open
 * Prevents address bar show/hide on mobile and page refresh
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
 * @param isOpen - Whether the popup/modal is open (can be a boolean or expression like `isOpen || showNestedPopup`)
 */
export function usePreventScroll(isOpen: boolean) {
  const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  useIsoLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    if (isOpen) {
      // Store scroll position
      const scrollY = typeof window.scrollY === 'number' ? window.scrollY : window.pageYOffset || 0;
      const body = document.body;
      const html = document.documentElement;
      
      // Lock body scroll while preserving current position
      // Prevent page scroll via both html and body to avoid UA quirks
        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
      body.style.left = '0';
      body.style.right = '0';
        body.style.top = `-${scrollY}px`;
      
      // Prevent ALL scroll events on page level (window/document/html/body)
      // Modal content can scroll internally, but page should never scroll
      const preventScroll = (e: Event) => {
        // Always prevent scroll on window, document, html, or body
        // These are the page-level scroll targets
        const scrollTarget = e.target;
        const currentTarget = e.currentTarget;
        
        // If the scroll event is on page-level elements, always prevent
        if (scrollTarget === window || scrollTarget === document || 
            scrollTarget === body ||
            currentTarget === window || currentTarget === document ||
            currentTarget === body) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
        
        // For scroll events on other elements (like modal content),
        // check if they're trying to cause page scroll
        const target = e.target as HTMLElement;
        if (target && target.nodeType === 1) { // Element node
          // Check if this element is inside a modal
          const modalContent = target.closest('[class*="overflow-y-auto"], [class*="overflow-y-scroll"]');
          
          // If it's a modal content scroll, allow it (don't prevent)
          // But if it's trying to bubble to page, we'll catch it above
          if (modalContent) {
            // This is a modal internal scroll - allow it
            return;
          }
        }
        
        // Default: prevent all other scroll events
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      };
      
      // Track touch start for boundary detection and swipe detection
      let touchStartY = 0;
      let touchStartX = 0;
      let touchStartElement: HTMLElement | null = null;
      
      // Prevent touchstart to block any initial scroll gesture
      const preventTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const touch = e.touches[0];
        
        // Record touch start position for boundary detection and swipe detection
        if (touch) {
          touchStartY = touch.clientY;
          touchStartX = touch.clientX;
          touchStartElement = target;
        }
        
        // If touching the overlay or body directly, prevent
        if (target === body || 
            (target.classList && target.classList.contains('fixed') && target.classList.contains('inset-0'))) {
          const modalContent = target.closest('[class*="overflow-y-auto"], [class*="overflow-y-scroll"]');
          if (!modalContent) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      };
      
      // Prevent ALL touchmove events that could cause page scrolling
      // Only allow touch inside modal content for internal scrolling
      // Allow horizontal swipes (swipe gestures) to pass through
      const preventTouch = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        const touch = e.touches[0] || e.changedTouches[0];
        
        // Check if this is a horizontal swipe gesture (allow it to pass through)
        if (touch && touchStartElement) {
          const deltaX = Math.abs(touch.clientX - touchStartX);
          const deltaY = Math.abs(touch.clientY - touchStartY);
          
          // If movement is primarily horizontal (swipe gesture), allow it
          // This allows swipe gestures to work even when popups are open
          if (deltaX > deltaY && deltaX > 10) {
            // This is a horizontal swipe - allow it to pass through for gesture handlers
            return;
          }
        }
        
        // Check if this is inside a scrollable modal content area
        const modalContent = target.closest('[class*="overflow-y-auto"], [class*="overflow-y-scroll"]');
        
        // If NOT inside modal content, prevent completely
        if (!modalContent) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
        
        // Inside modal content: check boundaries to prevent page scroll
        if (modalContent && touchStartElement) {
          const scrollableEl = modalContent as HTMLElement;
          
          if (touch) {
            const deltaY = touch.clientY - touchStartY;
            const isAtTop = scrollableEl.scrollTop <= 0;
            const isAtBottom = scrollableEl.scrollTop >= scrollableEl.scrollHeight - scrollableEl.clientHeight - 1;
            
            // If at top and trying to scroll down (positive delta), or at bottom and trying to scroll up (negative delta)
            // This would cause page scroll - prevent it
            if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }
        }
        
        // Allow modal internal scrolling - don't prevent
      };
      
      // Prevent wheel events
      const preventWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        const modalContent = target.closest('[class*="overflow-y-auto"], [class*="overflow-y-scroll"]');
        if (!modalContent) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      };
      
      // Add event listeners with maximum capture
      window.addEventListener('scroll', preventScroll, { passive: false, capture: true });
      document.addEventListener('scroll', preventScroll, { passive: false, capture: true });
      body.addEventListener('scroll', preventScroll, { passive: false, capture: true });
      
      document.addEventListener('touchmove', preventTouch, { passive: false, capture: true });
      document.addEventListener('touchstart', preventTouchStart, { passive: false, capture: true });
      
      window.addEventListener('wheel', preventWheel, { passive: false, capture: true });
      document.addEventListener('wheel', preventWheel, { passive: false, capture: true });
      
      return () => {
        if (typeof document !== 'undefined') {
          const bodyEl = document.body;
          
          // Restore all styles
          bodyEl.style.overflow = '';
          bodyEl.style.position = '';
          bodyEl.style.width = '';
          bodyEl.style.top = '';
          bodyEl.style.left = '';
          bodyEl.style.right = '';
          
          const htmlEl = document.documentElement;
          htmlEl.style.overflow = '';
          
          // Restore scroll position
          window.scrollTo(0, scrollY);
          
          // Remove all event listeners
          window.removeEventListener('scroll', preventScroll, { capture: true } as EventListenerOptions);
          document.removeEventListener('scroll', preventScroll, { capture: true } as EventListenerOptions);
          bodyEl.removeEventListener('scroll', preventScroll, { capture: true } as EventListenerOptions);
          
          document.removeEventListener('touchmove', preventTouch, { capture: true } as EventListenerOptions);
          document.removeEventListener('touchstart', preventTouchStart, { capture: true } as EventListenerOptions);
          
          window.removeEventListener('wheel', preventWheel, { capture: true } as EventListenerOptions);
          document.removeEventListener('wheel', preventWheel, { capture: true } as EventListenerOptions);
        }
      };
    } else {
      // Clean up when closed
      const body = document.body;
      
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
    }
  }, [isOpen]);
}

