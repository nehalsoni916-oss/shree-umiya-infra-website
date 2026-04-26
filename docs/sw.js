// ===== SERVICE WORKER — Shree Umiya InfraProject =====
// Provides offline caching for GitHub Pages deployment

const CACHE_NAME   = 'shree-umiya-v2';
const CACHE_STATIC = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './assets/logo.jpg',
  './assets/favicon.svg',
  './assets/favicon.ico',
];
const CACHE_CDN = [
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.js',
];

// ===== INSTALL: Pre-cache static assets =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache local files first (required), CDN files best-effort
        return cache.addAll(CACHE_STATIC).then(() => {
          return Promise.allSettled(
            CACHE_CDN.map(url => cache.add(url).catch(() => null))
          );
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ===== ACTIVATE: Clean up old caches =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ===== FETCH: Serve from cache, fall back to network =====
self.addEventListener('fetch', event => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Skip Formspree / API requests — always go to network
  if (event.request.url.includes('formspree.io')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Only cache successful same-origin or CDN responses
          if (
            response.ok &&
            (event.request.url.startsWith(self.location.origin) ||
             event.request.url.startsWith('https://fonts.') ||
             event.request.url.startsWith('https://cdnjs.') ||
             event.request.url.startsWith('https://unpkg.'))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
