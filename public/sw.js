// Strongly version the SW to force updates after deploys
const VERSION = 'v3';
const STATIC_CACHE = `static-${VERSION}`;

// Precache only minimal assets. Do NOT cache index.html aggressively.
const PRECACHE_URLS = ['/index.html'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-first for navigation requests so new UI shows up immediately
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request, { cache: 'no-store' });
          const cache = await caches.open(STATIC_CACHE);
          cache.put('/index.html', fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await caches.match('/index.html');
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // For other requests (static assets), cache-first with background update
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        // Try to update in the background
        fetch(request).then((resp) => {
          if (resp && resp.ok) {
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, resp.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      try {
        const resp = await fetch(request);
        if (resp && resp.ok && request.method === 'GET') {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, resp.clone());
        }
        return resp;
      } catch (err) {
        return Response.error();
      }
    })()
  );
});
