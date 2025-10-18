// Small Service Worker skeleton for PWA caching & network-first strategy for API
const CACHE_NAME = 'rapidpos-static-v1';
const ASSETS = [
  '/', '/index.html', '/css/app.css', '/js/app.js', '/manifest.json'
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (evt) => {
  clients.claim();
});

self.addEventListener('fetch', (evt) => {
  const url = new URL(evt.request.url);

  // Allow replication requests to pass through
  if (url.pathname.startsWith('/_replicate') || url.pathname.startsWith('/_db/')) {
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match(evt.request))
    );
    return;
  }

  evt.respondWith(
    caches.match(evt.request).then(cached => {
      return cached || fetch(evt.request).then(res => {
        if (evt.request.method === 'GET') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(evt.request, copy));
        }
        return res;
      });
    })
  );
});