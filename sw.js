const CACHE_NAME = 'clipo-v4';
const ICON_ASSETS = [
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
];
const CDN_ORIGINS = [
  'https://cdn.jsdelivr.net',
  'https://cdnjs.cloudflare.com',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ICON_ASSETS).catch(() => {}))
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
  const url = new URL(event.request.url);
  const isCDN = CDN_ORIGINS.some(o => event.request.url.startsWith(o));

  // HTMLナビゲーションは常にネットワークから（CSPヘッダーを最新に保つ）
  if (event.request.mode === 'navigate') return;

  // 同一オリジンでもCDNでもないリクエストはSWを素通り
  if (url.origin !== self.location.origin && !isCDN) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        if (isCDN) {
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return fetchRes;
      });
    }).catch(() => new Response('', {status: 503}))
  );
});
