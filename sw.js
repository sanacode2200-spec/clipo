const CACHE_NAME = 'clipo-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];
const FFMPEG_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg-core.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.wasm/0.11.6/ffmpeg-core.wasm',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(STATIC_ASSETS);
      cache.addAll(FFMPEG_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        if (event.request.url.includes('cdnjs.cloudflare.com')) {
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return fetchRes;
      });
    }).catch(() => caches.match('/'))
  );
});
