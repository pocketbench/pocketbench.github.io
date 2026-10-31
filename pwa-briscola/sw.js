// Service worker: modello unico per tutti i giochi, scripts/build.js lo scrive in dist/<id>/sw.js
// sostituendo prefisso, versione ed elenco dei file da tenere in cache.
// Il dominio è condiviso con gli altri giochi: si cancellano solo le cache di questo gioco (prefisso).
const PREFIX = 'briscola-amica-';
const CACHE = `${PREFIX}3e76cb133d`;
const ASSETS = ["./","./css/main.css","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/icon-maskable.svg","./icons/icon.svg","./index.html","./js/main.js","./manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((hit) => hit ?? fetch(event.request)));
});
