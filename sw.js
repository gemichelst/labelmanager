/* LabelManager OS — Service Worker v1 */
const CACHE = 'lm-v1';
const PRECACHE = [
  './index.html',
  './link.html',
  './upload.html',
  './manifest.json',
  './assets/css/style_merged.css',
  './assets/js/auth.js',
  './assets/js/index_merged.js',
];

self.addEventListener('install', e =>
  e.waitUntil(
    caches.open(CACHE).then(async cache => {
      // Cache each file individually — skip failures silently
      await Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  )
);

self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
);

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
      .catch(() => caches.match('./index.html'))
  );
});
