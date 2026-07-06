const CACHE = 'financeos-v3';
// Solo cacheamos assets estáticos que no cambian — el HTML va siempre a la red
const STATIC = ['/icon.svg', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // API calls y HTML: siempre red, sin cache
  if (url.pathname.startsWith('/api/') || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(fetch(e.request).catch(() =>
      (url.pathname.endsWith('.html') || url.pathname === '/')
        ? new Response('<h1 style="font-family:sans-serif;text-align:center;margin-top:20vh">Sin conexi\xF3n — abr\xED la app cuando tengas internet.</h1>', {headers:{'content-type':'text/html; charset=utf-8'}})
        : new Response('{"error":"offline"}', {headers:{'content-type':'application/json'}})
    ));
    return;
  }
  // Assets estáticos: cache first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }))
  );
});
