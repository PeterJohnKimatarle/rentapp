// Service worker for PWA installability
self.addEventListener('install', (event) => {
  console.log('SW: Install event fired');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activate event fired');
  // Claim all clients
  event.waitUntil(self.clients.claim());
});

// Fetch event handler - required for PWA installability
self.addEventListener('fetch', (event) => {
  // For PWA installability, we just need to handle fetch events
  // We don't need to cache anything, just respond to fetch requests
  event.respondWith(
    fetch(event.request).catch(() => {
      // Return a basic offline response if fetch fails
      return new Response('Offline', { status: 503 });
    })
  );
});
