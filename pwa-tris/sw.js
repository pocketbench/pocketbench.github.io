// Service worker: precache di tutti gli asset (elenco e versione generati da scripts/build.js).
// Il dominio è condiviso con gli altri giochi: si cancellano solo le cache di questo gioco (prefisso).
const PREFIX = 'tris-amico-';
const CACHE = `${PREFIX}7f5094e42d`;
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
