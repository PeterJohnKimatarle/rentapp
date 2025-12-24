// Minimal service worker for PWA installability
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients
  event.waitUntil(self.clients.claim());
});
