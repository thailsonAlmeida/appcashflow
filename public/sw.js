const CACHE_NAME = 'cashflow-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => {
        // In development (localhost), unregister the service worker and refresh open tabs
        if (
          self.location.hostname === 'localhost' ||
          self.location.hostname === '127.0.0.1'
        ) {
          return self.registration.unregister().then(() =>
            self.clients.matchAll({ type: 'window' }).then((clients) => {
              clients.forEach((client) => client.navigate(client.url));
            })
          );
        }
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Never intercept requests in localhost development or Next.js internal HMR/chunks
  if (
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1' ||
    event.request.url.includes('/_next/')
  ) {
    return;
  }

  // Network-First strategy so updates are always reflected immediately when online
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
